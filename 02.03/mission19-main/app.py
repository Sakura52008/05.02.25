from flask import Flask, render_template, request, send_from_directory, redirect, url_for
import os

app = Flask(__name__)

# Папка для хранения загруженных файлов
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Разрешённые расширения файлов
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'txt', 'csv'}

# Функция для проверки расширения файла
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Главная страница: отображение списка файлов
@app.route('/')
def index():
    # Получаем список файлов из папки
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    file_info = []
    for file in files:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file)
        size = os.path.getsize(file_path)  # Размер файла
        file_info.append({'name': file, 'size': size})
    return render_template('index.html', files=file_info)

# Загрузка файла
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = file.filename
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return redirect(url_for('index'))
    return "Файл не поддерживается."

# Скачивание файла
@app.route('/uploads/<filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Удаление файла
@app.route('/delete/<filename>', methods=['POST'])
def delete_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(file_path):
        os.remove(file_path)
    return redirect(url_for('index'))

if __name__ == '__main__':
    # Создаём папку для хранения файлов, если её нет
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)
