from selenium import webdriver 
from selenium.webdriver.chrome.service import Service 
from selenium.webdriver.common.by import By 
import csv 
import time 
 
# Укажите путь к ChromeDriver 
service = Service(r'C://Users//Студент 11//Desktop//chromedriver.exe') 
driver = webdriver.Chrome(service=service) 
 
try: 
    # Открываем страницу категории "Бестселлеры" на labirint.ru 
    driver.get('https://www.labirint.ru/bestsellers/') 
    time.sleep(5)  # Ждем загрузки страницы 
 
    # Находим элементы книг 
    books = driver.find_elements(By.CLASS_NAME, 'product')[:10] 
    book_data = [] 
 
    for book in books: 
        try: 
            # Название книги 
            title = book.find_element(By.CLASS_NAME, 'product-title-link').text 
 
            # Автор книги 
            try: 
                author = book.find_element(By.CLASS_NAME, 'product-author').text 
            except: 
                author = "Автор не указан" 
 
            # Цена книги 
            try: 
                price = book.find_element(By.CLASS_NAME, 'price-val').text 
            except: 
                price = "Цена не указана" 
 
            # Рейтинг книги 
            try: 
                rating = book.find_element(By.CLASS_NAME, 'rating').get_attribute('title') 
            except: 
                rating = "Рейтинг не указан" 
 
            # Добавляем данные о книге в список 
            book_data.append({ 
                'Название': title, 
                'Автор': author, 
                'Цена': price, 
                'Рейтинг': rating 
            }) 
        except Exception as e: 
            print(f"Ошибка при обработке книги: {e}") 
 
    # Сохраняем данные в CSV-файл 
    with open('books.csv', 'w', newline='', encoding='utf-8') as csvfile: 
        fieldnames = ['Название', 'Автор', 'Цена', 'Рейтинг'] 
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames) 
 
        writer.writeheader() 
        writer.writerows(book_data) 
 
    print("Данные успешно сохранены в файл books.csv") 
finally: 
    driver.quit()
