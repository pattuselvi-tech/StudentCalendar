## 📅 Student Calendar:
    A colourful, animated calendar for college students. See your college events, add your own personal events, get a motivational quote every day, and even control the calendar with your **voice**.
Built with plain **HTML, CSS and JavaScript**. No frameworks, no installs, no build tools.

## ✨Features:
 -**Monthly calendar** with a page-flip animation when you change months
 -**College events** (exams, hackathons, holidays) shown in violet
 -**Personal events** you can add and delete, shown in amber
 -**Saved in your browser**, so your personal events are still there after a refresh
 -**Quote of the day** in Tanglish that changes with the date
 -**Voice navigation**: say "next month" or "go to 25 October"
 -**Voice event adding**: say "add event revise notes on 2 November"
 -**Fun animations**: confetti when you add an event, a glowing "today" cell, bouncing event dots and more
 -**Works on phones and laptops** (responsive design)
 -**Keyboard friendly**: tab to a date and press Enter
 -**Respects reduced motion**: animations switch off for people who prefer less movement

## 🧰 Built with:
|Technology     | Used for                               |
|---------------|----------------------------------------|
| HTML          | Page structure                         |
| CSS           | Colors, layout, animations             |
| JavaScript    | Calendar logic, events, voice features |
| local Storage | Saving personal events in the browser  |
| Web Speech API| Voice recognition                      |

## 📁 Project structure:
student-calendar/
├── index.html   → the page layout
├── style.css    → all the styling and animations
├── script.js    → the logic (calendar, events, voice)
└── README.md    → this file

## 🚀 How to run it:
You do not need to install anything.

### Option 1: Open the file (quickest)
1. Download or clone this project.
2. Double-click `index.html`.
3. It opens in your browser. 🎉
⚠️ In this option the **voice features may not work**, because browsers often block the microphone on pages opened as plain files. Use Option 2 for voice.

### Option 2: Use Live Server in VS Code (recommended)
1. Install [VS Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension.
3. Open the project folder in VS Code.
4. Right-click `index.html` and choose **Open with Live Server**.
The page opens at an address like `http://127.0.0.1:5500`, and the microphone works there.

## 🖱️ How to use it:
1. **Change months** with the ‹ and › buttons, or tap **Jump to today**.
2. **Tap a date** to see its events and that day's quote.
3. **Add a personal event**: select a date, type in the box and press **Add** (or press Enter).
4. **Delete a personal event** with the ❌ button.
5. **Look at the dots** under dates: violet means a college event, amber means a personal event.

## 🎤 Voice commands:
Click the **Voice** button, allow the microphone, and say one of these:
| You say                                | What happens                |
|----------------------------------------|-----------------------------|
| "Next month"                           | Goes to the next month      |
| "Previous month"                       | Goes to the previous month  |
| "Today"                                | Jumps to today's date       |
| "Tomorrow"                             | Selects tomorrow's date     |
| "Go to 25 October"                     | Opens and selects that date |
| "Open November 2026"                   | Shows that month            |
| "Add event revise notes on 2 November" | Adds the event on that date |
You can also use the **mic next to the Add box**. Just say the event, for example *"Submit record on 5 November"*. If you do not say a date, it uses the date you have selected.

**Tips for voice**
- Use **Chrome or Edge**. Firefox does not support speech recognition.
- You need an **internet connection**, because the browser sends your speech to an online service.
- Say dates as **numbers plus a month** ("25 October"), not "twenty fifth".
- Click the mic again to switch it off.

## 🛠️ Customise it:
### Add your own college events
Open `script.js` and find `collegeEvents` near the top. The date format is `"YYYY-MM-DD"`, and each date has a list of events:
"
const collegeEvents = {
    "2026-10-25": ["Internal Exam", "Lab Record Submission"],
    "2026-11-02": ["Hackathon", "Project Demo Round"],
    "2026-11-14": ["Holiday", "Children's Day Celebration"]
};
"
Add a new line, keep the commas, and save. Words like *exam*, *holiday* and *hackathon* get their own icons automatically (see `getIcon` in `script.js`).

### Change the quotes
Edit the `quotes` list in `script.js`. Add as many as you like, and the app rotates through them by day of the year.

### Change the colours
Open `style.css` and edit the variables at the very top:
"css
:root {
  --violet-dark: #3b0764;
  --violet: #5b21b6;
  --amber: #f59e0b;
}
"
Change these values and the whole app updates.

### Reset the sample personal events
Open your browser's developer tools, go to the **Console** and run:
"js
localStorage.clear(); location.reload();
"

## 🧠 How it works (for learners)
- **Drawing the calendar:** JavaScript finds which weekday the month starts on and how many days it has, then creates one `div` for each day.
- **Storing events:** events are kept in an object like `{ "2026-10-25": ["Call home"] }` and saved with `localStorage`, which stores text in your browser.
- **Animations:** most are CSS `@keyframes`. JavaScript only adds or removes class names to start them.
- **Voice:** the browser's `SpeechRecognition` API turns speech into text. The code then checks the text for words like "next month" or "add event".

Good things to study in the code:
| Topic          | Where to look                          |
|----------------|----------------------------------------|
| DOM creation   | `renderCalendar()` in `script.js`      |
| Saving data    | `saveEvents()` in `script.js`          |
| Date handling  | `dateKey()` and `parseDatePhrase()`    |
| CSS animations | the `@keyframes` blocks in `style.css` |
| CSS variables  | `:root` in `style.css`                 |

## ⚠️ Known limitations
- Events are saved **only in your browser**. Another device or browser will not see them.
- College events are written directly in the code, so you edit them in `script.js`.
- Voice recognition works only in Chromium browsers (Chrome, Edge) and needs internet.

## 🔮 Ideas for the future
- [ ] Edit existing events
- [ ] Event reminders and notifications
- [ ] Dark mode toggle
- [ ] Load college events from a JSON file or an API
- [ ] Export events to Google Calendar
- [ ] Support for voice commands in Tamil

## 🤝 Contributing
Suggestions and improvements are welcome.
1. Fork this repository
2. Create a branch: `git checkout -b my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push it: `git push origin my-feature`
5. Open a Pull Request

## 📄 License
This project is open source under the [MIT License](LICENSE). Add a `LICENSE` file to your repository (GitHub can create one for you when you add a new file named `LICENSE`).

## 👋 Author
Made by **Pattuselvi.M** as a frontend practice project.
- GitHub: [@your-username](https://github.com/your-username)

If you like this project, give it a ⭐
