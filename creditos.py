from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

#Conexión a SQLite
def get_db():
    conn = sqlite3.connect("creditos.db")
    conn.row_factory = sqlite3.Row
    return conn

#Ruta principal
@app.route("/")
def index():
    return render_template("index.html")

# CRUD->

#Obtener todos los créditos
@app.route("/api/creditos", methods=["GET"])
def obtener_creditos():
    conn = get_db()
    cursor = conn.execute("SELECT * FROM creditos")
    creditos = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(creditos)

#Registrar un nuevo credito
@app.route("/api/creditos", methods=["POST"])
def registrar_credito():
    data = request.json
    conn = get_db()
    cursor = conn.execute(
        "INSERT INTO creditos (cliente, monto, tasa_interes, plazo, fecha_otorgamiento) VALUES (?, ?, ?, ?, ?)",
        (data["cliente"], data["monto"], data["tasa_interes"], data["plazo"], data["fecha_otorgamiento"])
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Crédito registrado", "id": cursor.lastrowid})

#Editar un crédito existente
@app.route("/api/creditos/<int:id>", methods=["PUT"])
def editar_credito(id):
    data = request.json
    conn = get_db()
    conn.execute(
        "UPDATE creditos SET cliente=?, monto=?, tasa_interes=?, plazo=?, fecha_otorgamiento=? WHERE id=?",
        (data["cliente"], data["monto"], data["tasa_interes"], data["plazo"], data["fecha_otorgamiento"], id)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Crédito actualizado"})

#Eliminar un crédito
@app.route("/api/creditos/<int:id>", methods=["DELETE"])
def eliminar_credito(id):
    conn = get_db()
    conn.execute("DELETE FROM creditos WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Crédito eliminado"})

if __name__ == "__main__":
    app.run(debug=True)
