let btnemail = document.getElementById("btnforemail");
btnemail.addEventListener("click", myOtpFunc);

async function myOtpFunc() {
    let email = document.querySelector(".inpemail");
    let jsonemail = email.value;
    await fetch("/nonpremiumOTPcreate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ jsonemail }),
    });
    console.log("Sent Post in JS");

    //Show
    document.querySelector(".otpdiv").classList.toggle("advancedHide");
    btnemail.classList.remove("btn");
    btnemail.classList.remove("btn-primary");
    btnemail.classList.add("advancedHide");
}

function genRandColor() {
    const red = Math.random() * 255;
    const green = Math.random() * 255;
    const blue = Math.random() * 255;

    return `rgba(${red} , ${green} , ${blue})`;
}