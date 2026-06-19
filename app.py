from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Game logic
def determine_winner(player_choice, computer_choice):
    if player_choice == computer_choice:
        return "tie"
    
    # Winning conditions: player beats computer
    if (player_choice == "rock" and computer_choice == "scissors") or \
       (player_choice == "paper" and computer_choice == "rock") or \
       (player_choice == "scissors" and computer_choice == "paper"):
        return "win"
    
    return "lose"

def get_computer_choice():
    choices = ["rock", "paper", "scissors"]
    return random.choice(choices)

def get_emoji(choice):
    emojis = {
        "rock": "✊",
        "paper": "✋",
        "scissors": "✌️"
    }
    return emojis.get(choice, "")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play', methods=['POST'])
def play():
    data = request.get_json()
    player_choice = data.get('choice')
    
    if player_choice not in ["rock", "paper", "scissors"]:
        return jsonify({"error": "Invalid choice"}), 400
    
    computer_choice = get_computer_choice()
    result = determine_winner(player_choice, computer_choice)
    
    # Map result to message
    messages = {
        "win": "You win! 🎉",
        "lose": "You lose! 😢",
        "tie": "It's a tie! 🤝"
    }
    
    return jsonify({
        "player_choice": player_choice,
        "computer_choice": computer_choice,
        "player_emoji": get_emoji(player_choice),
        "computer_emoji": get_emoji(computer_choice),
        "result": result,
        "message": messages[result]
    })

@app.route('/reset_score', methods=['POST'])
def reset_score():
    # Score is stored client-side, so just return success
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
