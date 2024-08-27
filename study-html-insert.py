from bs4 import BeautifulSoup

fileName = input('fileName.html : ').strip()

# Load the downloaded HTML file
with open(fileName, 'r', encoding='utf-8') as file:
	html_content = file.read()

# Define your custom content directly in the script
custom_content = """
	<link rel="stylesheet" href="style.css">
	<script src="script.js"></script>
"""

# Parse the HTML file
soup = BeautifulSoup(html_content, 'html.parser')

# Find the <head> section
head = soup.find('head')

# Insert custom content
head.append(BeautifulSoup(custom_content, 'html.parser'))

# Save the modified HTML file
with open(fileName, 'w', encoding='utf-8') as file:
	file.write(str(soup))

print("Custom styles and scripts have been added to the HTML file.")

