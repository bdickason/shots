Data Tracking
=============

We use Mixpanel to track important events within the app.

# Events we track:

1. Log In 'Login Successful'
2. Create a Project 'Create Project'
3. Post a Shot 'Post Shot'
4. Post a Comment 'Post Comment'

# Philosophy

We believe in only tracking a small number of important events. 

# When to track
Please add data to an **EXISTING** tracking event with reckless abandon! The more data and information the better.

Before adding **NEW** tracking, please carefully consider what you plan to add and make sure it's a clear measurement of either **Engagement** or **Retention**.

# How to track

## Add to existing event

Thank you for helping!!

### Make sure your data is in the JSON object

IF you're adding data to an existing event, there should already be a JSON object called `input` that you can append your data to. It will live in the `view` for a given component.

For example:
**Event**: 'Post Comment'
**File**: `commentsView.js`

### Verify that data is sent to Mixpanel

The `input` object is already being passed to Mixpanel. Any key and value you pass add will be recorded automagically.


## Creating a new event

*Note: Please read the section above on 'When to Track' before proceeding*

To add a tracking event, use the following command:

`mixpanel.track('Event Name', { key1: value1, key2: value2 });`

Event Name is a string that will be used in the Mixpanel reporting dashboard to identify events. The second parameter is a JSON object that 