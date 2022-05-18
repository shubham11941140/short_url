#include <bits/stdc++.h>
#include <sys/wait.h>
#include <unistd.h>
using namespace std;

int main()
{
    long long startTime = 0;
    vector<double> lsum(181, 0);
    vector<long long> reqcount(181, 0);
    vector<long long> failures(181, 0);
    fstream newfile;
    newfile.open("consolelog.txt", ios::in); // open a file to perform read operation using file object
    if (newfile.is_open())
    {
		// checking whether the file is open
        string tp;
        while (getline(newfile, tp))
        {
			// read data from file object and put it into string.
            // cout << tp << "\n"; //print the data of the string
            vector<string> tokens;

            // stringstream class check1
            stringstream check1(tp);

            string intermediate;

            // Tokenizing w.r.t. space ' '
            while (getline(check1, intermediate, ' '))
            {
                tokens.push_back(intermediate);
            }

            for (string s : tokens)
                cout << s << " ";
            cout << endl;

            long long curTime = stoll(tokens[1]);

            if (startTime == 0)
                startTime = curTime;

            double latency = stod(tokens[2]);

            if (latency == 0)
                continue;

            int fail = stoll(tokens[3]);
            int index = (curTime - startTime) / 10000;

            if (index > 180)
                continue;

            lsum[index] += latency;
            reqcount[index]++;
            failures[index]++;
        }
        newfile.close(); // close the file object.
    }

    fstream outfile;
    outfile.open("plot.txt", ios::out); // open a file to perform write operation using file object
    if (outfile.is_open())              // checking whether the file is open
    {
        for (int i = 0; i < 181; i++)
        {
            if (reqcount[i] != 0)
                outfile << i << " " << (lsum[i] / reqcount[i]) << " " << failures[i] << "\n";
        }
        outfile.close(); // close the file object
    }

    printf("Plotting the Graphs\n");
    int p1 = fork();

    if (p1 == 0)
    {
        /* This is the child process.  Execute the shell command. */
        char *args[3];
        args[0] = strdup("gnuplot");
        args[1] = strdup("plot_latency.plt");
        args[2] = NULL;

        /* This is the parent process.  Wait for the child to complete.  */
        execvp(args[0], args);
    }
    else if (p1 < 0)
        /* The fork failed.  Report failure.  */
        exit(1);
    else
        /* This is the parent process.  Wait for the child to complete.  */
        wait(NULL);

    printf("Graphs Plotted. Closing Client!\n");

    return 0;
}
