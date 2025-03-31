from flask import Flask
from flask_socketio import SocketIO, send
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('message')
def handle_message(data):
    print(f"Received message: {data}")
    send(data, broadcast=True)

if __name__ == "__main__":
    socketio.run(app, debug=True)