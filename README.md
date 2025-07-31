# 📦 Apify Integration Challenge

A web application that allows users to run an Apify actor, monitor its execution status, and display the output results.

---

## 🚀 How to Install and Run Your Application

### ✅ Prerequisites

* Node.js (version 16 or above)
* npm (or yarn)

### 🔧 Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/Pranay-Diddi/apify-challenge.git
cd apify-integration-challenge
```

* Once you've cloned the application, you’ll notice two folders:

  * `client`: contains the frontend code
  * `server`: contains the backend code

#### 2. Install Dependencies for Frontend

```bash
cd client
npm install
```

#### 3. Run the Frontend

```bash
npm run dev
```

* The client will be running at: `http://localhost:5173`

#### 4. Install Dependencies for Backend

Open a new terminal:

```bash
cd server
npm install
```

#### 5. Run the Backend

```bash
node app.js
```

* The server will be running at: `http://localhost:3000`


## 🧪 The Actor I Chose for Testing

I used the following actors from Apify for testing:

* `cheap google search results scraper `(google-scraper)

You can use either public actors or your own created actors from Apify.

---


## Screenshots demonstrating the working flow of testing and the application


1. Home Page — Enter Apify API Key
   
This is the initial screen where the user provides a valid Apify API key to begin.

<img width="1244" height="358" alt="image" src="https://github.com/user-attachments/assets/10b96b08-fa25-414c-b2f9-7aad2f09a53a" />


2. Actor Selection Screen

After verifying the API key, the available actors are fetched and displayed for selection.

<img width="1183" height="551" alt="image" src="https://github.com/user-attachments/assets/99c48fc4-e997-42ce-97ab-d39fe0e4e767" />


3. Dynamic Form Rendered Based on Actor Input Schema

Once an actor is selected, a dynamic input form is generated for required parameters.

<img width="1280" height="888" alt="image" src="https://github.com/user-attachments/assets/f3f36c5c-e0e1-4990-9a10-20baf2f3d7e8" />


4. Actor Execution Status

This screen shows the status of the actor execution (e.g., running, succeeded).

<img width="1055" height="574" alt="image" src="https://github.com/user-attachments/assets/e046a3ea-015d-44fe-8c30-f38ef9fd656e" />



5. Actor Task Success Message

Once the actor finishes execution successfully, a confirmation message is shown.


 <img width="574" height="164" alt="image" src="https://github.com/user-attachments/assets/47cc8d39-1c43-423d-82b9-6c713bb4371f" />



6. Displaying the Output

The final output/result from the actor is rendered on the screen in a readable format.

<img width="950" height="903" alt="image" src="https://github.com/user-attachments/assets/246f6a44-0e97-41e5-9529-d73e31719707" />

> ⚠️ Ensure you’re using a valid Apify API Key. You can create an account and generate your key at: [https://console.apify.com/sign-in](https://console.apify.com/sign-in)




## 💡 Assumptions or Notable Design Choices

* The UI dynamically renders input fields based on the actor’s input schema.
* Inputs are validated on the client side before submission.
* Actor execution status is polled periodically until the run is complete.

---

Feel free to reach out if any issues arise. Happy scraping! 🕷️
