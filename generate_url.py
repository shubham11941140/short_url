from csv import QUOTE_MINIMAL, writer
from random import choice, randint
from string import ascii_letters


# Function to generate random length string
def gen_str(n):
    return "".join(choice(ascii_letters) for _ in range(n))


# Function to generate random number from length 1-500
def gen_num(n):
    return randint(n // 2, n)


# Open a new CSV file
with open("allurl.csv", "w") as csvfile:

    writer = writer(csvfile,
                    delimiter=",",
                    quotechar='"',
                    quoting=QUOTE_MINIMAL)

    writer.writerow(["Number", "URL"])

    # 500 million
    for i in range(500 * 1000000):

        # Write to CSV file a string + random string of random length
        writer.writerow([
            i + 1,
            "https://github.com/shubham11941140/short_url/" +
            gen_str(gen_num(100)),
        ])
