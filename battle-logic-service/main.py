from fastapi import FastAPI
from models import BattleRequest, XPUpdateRequest
import random
import uvicorn
from level1 import router as level1_router
from utils import (
    get_type_effectiveness,
    augment_move_data,
    get_move_category,
    add_experience,
    xp_needed_for_level
)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(level1_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Battle Logic Service with detailed breakdown!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/calculate_damage/")
def calculate_damage(battle: BattleRequest):
    # Convert move to dict and augment with extra effects.
    move_dict = battle.move.dict()  # Use model_dump() if using Pydantic V2.
    print("Original move data:", move_dict)
    move_dict = augment_move_data(move_dict)
    print("Augmented move data:", move_dict)

    # Prepare a dictionary to capture details.
    details = {}
    
    # Check if the move hits.
    hit_roll = random.random()
    details["hit_roll"] = hit_roll
    details["accuracy"] = move_dict["accuracy"]
    if hit_roll > move_dict["accuracy"]:
        details["hit"] = False
        return {
            "result": "miss",
            "damage": 0,
            "details": details
        }
    details["hit"] = True

    effect_type = move_dict.get("effect_type", "damage")
    
    # --- Multi-hit Moves ---
    if effect_type == "multi_hit":
        if move_dict.get("hit_range") and len(move_dict["hit_range"]) == 2:
            min_hits, max_hits = move_dict["hit_range"]
            num_hits = random.randint(min_hits, max_hits)
            details["hit_range"] = move_dict["hit_range"]
            details["num_hits"] = num_hits
        else:
            num_hits = 1
            details["num_hits"] = num_hits
        total_damage = 0
        hit_details = []
        details["individual_hits"] = []
        for i in range(num_hits):
            current_hit = {}
            current_hit["hit_roll"] = random.random()
            if current_hit["hit_roll"] <= move_dict["accuracy"]:
                # Determine the correct attack/defense stats based on move category.
                if battle.move.category == "physical":
                    stat = battle.attacker.attack
                    defense = battle.defender.defense if battle.defender.defense else 1
                elif battle.move.category == "special":
                    stat = battle.attacker.special_atk
                    defense = battle.defender.special_def if battle.defender.special_def else 1
                else:
                    stat = battle.attacker.attack
                    defense = battle.defender.defense if battle.defender.defense else 1

                # Incorporate the level factor similar to the Pokémon formula.
                level_factor = ((2 * battle.attacker.level) / 5) + 2

                # Calculate base damage using the formula: (((level_factor * power * (attack/defense)) / 50) + 2)
                base_damage = ((level_factor * move_dict["power"] * (stat / defense)) / 50) + 2
                current_hit["stat_ratio"] = stat / defense
                current_hit["level_factor"] = level_factor
                current_hit["base_damage"] = base_damage

                # Calculate type effectiveness multiplier.
                defender_types = battle.defender.types or ["normal"]
                type_multiplier = get_type_effectiveness(move_dict["move_type"], defender_types)
                current_hit["type_multiplier"] = type_multiplier

                # Determine if this hit is a critical hit.
                crit = random.random() < 0.0625
                crit_multiplier = 1.5 if crit else 1.0
                current_hit["critical_hit"] = crit
                current_hit["crit_multiplier"] = crit_multiplier

                # Apply a random damage variation factor.
                random_factor = random.uniform(0.85, 1.0)
                current_hit["random_factor"] = random_factor

                # Final damage calculation includes all modifiers.
                final_damage = base_damage * type_multiplier * crit_multiplier * random_factor
                hit_damage = round(final_damage, 2)
                current_hit["hit_damage"] = hit_damage

                total_damage += hit_damage
                hit_details.append(hit_damage)
            else:
                hit_details.append(0)
                current_hit["hit_damage"] = 0

            details["individual_hits"].append(current_hit)
            details["total_damage"] = total_damage

        return {
            "result": "hit",
            "damage": total_damage,
            "hits": num_hits,
            "hit_details": hit_details,
            "details": details
        }
    
    # --- Healing Moves ---
    elif effect_type == "heal":
        heal_amount = move_dict.get("power", 0)
        random_factor = random.uniform(0.9, 1.0)
        heal_amount = round(heal_amount * random_factor, 2)
        details["heal_amount"] = heal_amount
        details["random_factor"] = random_factor
        return {
            "result": "heal",
            "heal_amount": heal_amount,
            "target": "self",
            "details": details
        }
    
    # --- Status-only Moves ---
    elif effect_type == "status":
        status_applied = None
        status_roll = random.random()
        details["status_roll"] = status_roll
        details["effect_chance"] = move_dict.get("effect_chance")
        if move_dict.get("status_effect") and move_dict.get("effect_chance"):
            if status_roll < move_dict["effect_chance"]:
                status_applied = move_dict["status_effect"]
        details["status_effect_applied"] = status_applied
        print("Status branch - roll:", status_roll, "effect_chance:", move_dict.get("effect_chance"), "applied:", status_applied)
        return {
            "result": "status",
            "status_effect_applied": status_applied,
            "details": details
        }
    
    # --- Default: Standard Damage Moves ---
    else:
        move_power = move_dict.get("power", 0.0)  # Default to 0 if power is not provided
        if move_power is None or move_power == 0:
            return {
                "result": "hit",
                "damage": 0,  # No damage for non-damaging moves
                "category": battle.move.category,
                "critical_hit": False,
                "type_multiplier": 1.0,
                "status_effect_applied": None,
                "details": {"reason": "Move has no power"}
            }
        if battle.move.category == "physical":
            stat_ratio = battle.attacker.attack / battle.defender.defense if battle.defender.defense else 1
        elif battle.move.category == "special":
            stat_ratio = battle.attacker.special_atk / battle.defender.special_def if battle.defender.special_def else 1
        else:
            stat_ratio = battle.attacker.attack / battle.defender.defense if battle.defender.defense else 1

        details["stat_ratio"] = stat_ratio

        # **Add Level Factor**
        level_factor = (2 * battle.attacker.level / 5) + 2
        details["level_factor"] = level_factor

        # **Use the proper Pokémon-like formula**
        base_damage = ((level_factor * move_power * stat_ratio) / 50) + 2
        details["base_damage_pre_type"] = base_damage

        # Apply type effectiveness
        defender_types = battle.defender.types or ["normal"]
        type_multiplier = get_type_effectiveness(move_dict["move_type"], defender_types)
        details["type_multiplier"] = type_multiplier
        base_damage *= type_multiplier

        # Apply critical hit multiplier
        crit = random.random() < 0.0625
        details["critical_hit"] = crit
        crit_multiplier = 1.5 if crit else 1.0
        details["crit_multiplier"] = crit_multiplier
        base_damage *= crit_multiplier

        # Apply random factor (for variability)
        random_factor = random.uniform(0.85, 1.0)
        details["random_factor"] = random_factor
        damage = round(base_damage * random_factor, 2)
        details["final_damage"] = damage

        # Check for status effect application.
        status_applied = None
        if move_dict.get("status_effect") and move_dict.get("effect_chance"):
            status_roll = random.random()
            details["status_roll"] = status_roll
            if status_roll < move_dict["effect_chance"]:
                status_applied = move_dict["status_effect"]
            details["status_effect_applied"] = status_applied

        return {
            "result": "hit",
            "damage": damage,
            "category": battle.move.category,
            "critical_hit": crit,
            "type_multiplier": type_multiplier,
            "status_effect_applied": status_applied,
            "details": details
        }


@app.post("/add_experience/")
def add_experience_endpoint(xp_update: XPUpdateRequest):
    stats_dict = xp_update.attacker.dict()
    increments = {
        "attack": 2,
        "defense": 2,
        "hp": 5,
        "speed": 1,
        "special_atk": 2,
        "special_def": 2
    }
    updated_stats = add_experience(stats_dict, xp_update.xp_gained, increments)
    return {"updated_stats": updated_stats}

@app.post("/turn_order/")
def turn_order(data: dict):
    if data["pokemon1"]["speed"] > data["pokemon2"]["speed"]:
        first = "pokemon1"
    elif data["pokemon1"]["speed"] < data["pokemon2"]["speed"]:
        first = "pokemon2"
    else:
        first = "tie"
    return {"first": first}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
