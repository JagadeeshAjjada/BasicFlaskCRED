from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# SQLite database config (database file will be created in your project folder)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)


# Create a User model (table)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.String(100), unique=True, nullable=False)
    dep = db.Column(db.String(100), unique=True, nullable=False)


# Create a User model (table)
class Classes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    c_name = db.Column(db.String(100), nullable=False)
    dep = db.Column(db.String(100), unique=True, nullable=False)


# Create the database tables before the first request
@app.before_request
def create_tables():
    if not hasattr(app, 'tables_created'):
        db.create_all()
        app.tables_created = True


@app.route('/')
def home():
    return render_template('index.html')


# CREATE user — POST route
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    name = data.get('name')
    age = data.get('age')
    dep = data.get('dep')
    if not name or not age or not dep:
        return jsonify({'error': 'Name, dep, and age are required!'}), 400
    new_user = User(name=name, age=age, dep=dep)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully!'}), 201


# READ users — GET route
@app.route('/get_users', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = [{'id': user.id, 'name': user.name, 'age': user.age, 'dep': user.dep} for user in users]
    return jsonify(user_list)


# UPDATE user — PUT route
@app.route('/update_user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found!'}), 404
    data = request.get_json()
    user.name = data.get('name', user.name)
    user.age = data.get('age', user.age)
    user.dep = data.get('dep', user.dep)
    db.session.commit()
    return jsonify({'message': 'User updated successfully!'})


# GET single user - GET route
@app.route('/get_single_user/<int:user_id>', methods=['GET'])
def get_single_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found!"}), 404
    result = {
        "name": user.name,
        "age": user.age,
        "dep": user.dep
    }
    return result


# DELETE user — DELETE route
@app.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found!'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully!'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
