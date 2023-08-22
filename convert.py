def replace_spaces_with_semicolons(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as infile:
        content = infile.read()

    modified_content = content.replace(',', '.')

    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write(modified_content)

if __name__ == '__main__':
    input_file_path = 'C:\\Users\\bartek\\Desktop\\inzynierka\\dane_historyczne_old.txt'  # Replace with your input file path
    output_file_path = 'C:\\Users\\bartek\\Desktop\\inzynierka\\dane_historyczne.txt'  # Replace with desired output file path
    replace_spaces_with_semicolons(input_file_path, output_file_path)