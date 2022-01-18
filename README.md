# short_url
Contains a full fledged implementation of a URL Shortener Web Application

### Refer to the design document in the file: "Design Document 16 Jan 2022.pdf"

To run the website, go to: **http://ec2-54-173-198-224.compute-1.amazonaws.com:8000/home**

To check the performance overhead of the website by using CURL API call, open the Linux command line
and run the **performance.py** file. If you wish to edit the parameters for testing, you are free to do so.

```
python3 performance.py --command-line arguments
```
If you want to use command line CURL Requests you are free to do so

If you want to create entries and delete using the script a few arguments are enough.

I will give a brief demo on how to operate it and you can directly run it.

**1st Argument:**
Command line argument will mean:

```
1 -> To Read
2 -> To Delete
3 -> To Shorten
4 -> To Create Custom
```

**2nd Argument:**
It will be the API_KEY to verify the user authenticity - Can be entered as a normal string

**3rd Argument:**
It will contain the website.

Enter the website enclosed in double quotes(" ") which will not cause parsing error

```
To Read -> Short URL string will be entered
To Delete -> Short URL string will be entered
To Shorten -> Long URL string will be entered
To Create Custom -> Long URL string will be entered
```

After which we have custom arguments associated to a particular functionality

**4th Argument:**
For reading and shortening purpose -> We can enter a count value if we want to check system performance.
It will loop and check the performance of the system

**To make a Custom URL**

Argument 4 -> Enter custom short string

Argument 5 -> Duration after which the URL will expire (In days)

Do not use **Copy to Clipboard** as we are running this on a non secure cloud server as the SSH has not been established.

The Clipboard functionality works only in a secure environment which we will create as the project moves on

Refer to: **https://stackoverflow.com/questions/52054635/copy-clipboard-function-working-locally-but-not-working-server** for more details.



