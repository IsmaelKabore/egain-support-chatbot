# eGain Package Assistant

My take-home project for eGain. It's a chatbot called Ava that helps a customer
when their package says "delivered" but they can't find it.

To try it, just open `index.html` in your browser. Nothing to install.

Use this tracking number for the demo: `1Z999AA10123456784`

## Files

- `index.html` - the page
- `styles.css` - the design
- `flow.js` - everything Ava says, step by step
- `interface.js` - builds the messages, package card, photo and claim card
- `app.js` - moves the conversation forward and reads what the customer types
- `images/delivery-photo.jpg` - the delivery photo shown in the chat

## How it works

Each step of the conversation is written in `flow.js`: what Ava says, the buttons
she shows, and where each answer goes next. Ava always knows which step she's on,
so she knows what kind of answer to expect.

Once the package is found in the system, Ava guides the search one spot at a time:
side entrance, front door, mailroom, neighbors, then the delivery photo. If it's
still missing and it's been more than 24 hours, she can open a claim (with a claim
number and a date to follow up) or pass the customer to an agent.

You can click the buttons or type. Ava understands things like "yeah", "nope, I
already checked", "talk to someone" or "that's not my door". If she doesn't
understand, she says so and shows the options again.

## Things to try

- Say "no" at every spot and open a claim
- Ask for an agent after opening the claim
- Click "That's not my door" on the delivery photo
- Type a wrong tracking number, or "abc"
- Say you don't have your tracking number
- Type something off topic like "my laptop won't turn on"

The package, claim number, photo and agent are all fake for the demo.
