const feedbackForm = document.getElementById("feedbackForm");

const successMessage =
    document.getElementById("successMessage");

const errorMessage =
    document.getElementById("errorMessage");

const submitBtn =
    document.getElementById("submitBtn");

const messageInput =
    document.getElementById("message");

const charCount =
    document.getElementById("charCount");


// =========================
// CHARACTER COUNTER
// =========================

messageInput.addEventListener("input", function () {

    charCount.textContent =
        messageInput.value.length;

});


// =========================
// FORM SUBMISSION
// =========================

feedbackForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Hide old messages

        successMessage.style.display = "none";

        errorMessage.style.display = "none";


        // Get values

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const category =
            document.getElementById("category").value;

        const rating =
            document.querySelector(
                'input[name="rating"]:checked'
            );

        const message =
            messageInput.value.trim();


        // Check rating

        if (!rating) {

            alert("Please select a rating.");

            return;

        }


        // Prepare data

        const feedbackData = {

            name: name,

            email: email,

            category: category,

            rating: Number(rating.value),

            message: message

        };


        // Disable button

        submitBtn.disabled = true;

        submitBtn.textContent =
            "Submitting...";


        try {

            const response = await fetch(
                "/api/feedback",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(feedbackData)
                }
            );


            const result =
                await response.json();


            if (response.ok) {

                // Show success

                successMessage.style.display =
                    "block";


                // Clear form

                feedbackForm.reset();


                // Reset character counter

                charCount.textContent = "0";


                // Scroll to success message

                successMessage.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            } else {

                errorMessage.textContent =
                    result.message ||
                    "Unable to submit feedback.";

                errorMessage.style.display =
                    "block";

            }


        } catch (error) {

            console.error(error);

            errorMessage.textContent =
                "Unable to connect to the server.";

            errorMessage.style.display =
                "block";

        }


        // Enable button again

        submitBtn.disabled = false;

        submitBtn.textContent =
            "Submit Feedback";

    }
);
