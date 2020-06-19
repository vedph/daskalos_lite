# Daskalos Lite

A toy web app for our 2020 Summer Camp.

This project was generated using [Nx](https://nx.dev).

Deploy sample (for a subpath, here `apps/daskalos2`):

```txt
ng build --prod --base-href /apps/daskalos2/
```

## Overview

Daskalos is a minimalist approach to computer-based self-evaluation quizzes designed to run without any backend. It's just a quick solution for proposing interactive self-evaluation sessions, backed by simple JSON files (one for each quiz) in a plain web server.

As it stands now, it is just a refactoring of an old resource I had created for one of my courses; it could be extended at will, but it would not make sense when a plethora of serious online learning platforms are available. This should be treated only as an easy to write and deploy solution which can be used in quick and light scenarios, just like we can provide slides, PDFs, web links, or other learning material.

You can take a quick tour by testing a dummy, 5-questions only quiz, or a more realistic one (about LOD), at <www.fusisoft.it/apps/daskalos2>. The JSON code used to build the dummy quiz in this demo can be found at <https://gist.github.com/Myrmex/cfa91395ad78b994250fd9301c1eaa3f>.

## Main Features

- single and multiple answers
- custom timeout
- custom HTML-based content for each question
- custom score for each answer in each step
- no-questions steps (used to introduce a section of the quiz)
- branching flow

A Daskalos quiz is structured as a flow including any number of steps. Each flow has these metadata:

- `id`: a unique textual ID for the flow.
- `label`: the flow's label.
- `description`: a short description.
- `author`: the flow's author(s).
- `category`: the flow's category.
- `lastUpdated`: date and time the flow was last updated.
- `minScore`: the minimum score to be reached by a quiz user to pass it.
- `steps`: 1 or more steps.

Each step contains any number of choices, plus these metadata (those marked with an asterisk are required, all the others are optional):

- `number`\*: the step number.
- `label`\*: the step label.
- `prompt`\*: the step prompt.
- `content`: HTML-based content for the step.
- `maxChoices`: the maximum number of choices allowed to be selected. The default value is 1.
- `timeAllotted`: the maximum time, in seconds, allowed before the quiz automatically moves
  to the next step. When set, this makes the question time-limited.
- `expiredTarget`: the number of the target step to move to when the allotted time has expired.
- `choices`: any number of choices.
  
A choice is a single choice the user can select in each step. Each choice has the following properties:

- `targetStepNumber`: the number of the step to go to when the choice is selected. This allows for branching, i.e. selecting different paths in the flow according to user answers.
- `label`: the choice's label.
- `score`: the choice score. This is a number, either positive or negative, which is added to the flow's total score when this choice is selected.

## Sample

As a sample, consider the demo quiz.

Here, we start with a single branch including 4 steps. The first just introduces the quiz, and has no questions. Step 4 has two answers: according to the user's pick, the quiz flows into a different branch. In this minimalist sample, we just have 2 other steps for each branch, up to the quiz end.

Let us dissect the corresponding JSON code. This is the main structure: a flow object with its properties, and an array with any number of steps:

```json
{
  "id": "demo",
  "label": "Demo Quiz",
  "description": "A fake demo quiz",
  "author": "Daniele Fusi",
  "category": "demo",
  "lastUpdated": "2020-05-13T15:00:00Z+01:00",
  "minScore": 3,
  "steps": []
}
```

Below we find step 2: it has a number, a label, an HTML content with an image and a text, and a prompt with a single answer to be selected among 3 choices. Each of these choices has its label and score, and its target step number.

To *enable branching*, we can just set the target step number to different values according to the selected choice.

Also, this is a *time-limited* question, where users have 30 seconds to select an answer; if they fail to do so, the flow continues automatically to the expired time target step (here 3).

```json
{
  "number": 2,
  "label": "Dogs",
  "content": "<div style=\"column-width: 20em;\"><img
  src=\"http://www.clker.com/cliparts/8/1/3/6/12161396651491232743lemmling_
  Cartoon_dog.svg.thumb.png\" alt=\"Dog\" style=\"float:left;margin: 4px
  16px;width:64px\"/><strong>Attention!</strong>: your time is limited.
  Quiz creators can specify a time-limited question by simply setting the
  <em>number of seconds</em> allowed before the quiz automatically skips to
  the step defined as the <em>next step after a timeout</em>.</div>",
  "prompt": "How do dogs do?",
  "maxChoices": 1,
  "timeAllotted": 30,
  "expiredTarget": 3,
  "choices": [
  {
    "score": 1,
    "targetStepNumber": 3,
    "label": "bark!"
  },
  {
    "score": -1,
    "targetStepNumber": 3,
    "label": "meow!"
  },
  {
    "score": -1,
    "targetStepNumber": 3,
    "label": "quack!"
  }
  ]
},
```

A *multiple-answers step* is sampled below. Here, the maximum count of allowed choices is 4 (rather than the default value of 1), and each correct choice contributes with a fraction (here 1/4, i.e. 0.25) to the total score of this step. The target step number equal to 0 means that this is the last step in its branch.

```json
{
  "number": 8,
  "label": "Sea - Octopus",
  "prompt": "What do octopus eat?",
  "timeAllotted": 35,
  "expiredTarget": 0,
  "content": "<p>Check <strong>all</strong> the answers that apply. This
  is a multiple-answers question sample.</p>",
  "maxChoices": 4,
  "choices": [
    {
      "targetStepNumber": 0,
      "label": "shrimps",
      "score": 0.25
    },
    {
      "targetStepNumber": 0,
      "label": "lobsters",
      "score": 0.25
    },
    {
      "targetStepNumber": 0,
      "label": "carrots",
      "score": -1
    },
    {
      "targetStepNumber": 0,
      "label": "snails",
      "score": 0.25
    },
    {
      "targetStepNumber": 0,
      "label": "crabs",
      "score": 0.25
    }
  ]
}
```

Once the flow completes, a summary for success or failure is displayed, with all the user's selections and the corresponding score for each.

## Infrastructure

This is a toy program from the "I'm in a hurry" series :), with a minimal infrastructure. You can provide any number of quizzes by just adding new JSON files, one for each quiz, in the flows folder of the web application, and rebuilding it.

The quiz ID will be equal to the file name (without the `.json` extension). Thus, the ID for `demo.json` under `assets/flows` is just `demo`.

To open a specific quiz, add its ID to the "hashed" app URL, like this (where the flow ID is `demo`):

```txt
www.fusisoft.it/apps/daskalos2/#/flows/demo
```

To make the solution simpler, there is no state management infrastructure; the only state to be preserved is the result of the quiz, which is stored in the local storage of the device's browser.

To deploy the application into any web server we just have to copy its files in some directory. If the app runs in a subpath, rebuild it first specifying the subpath like:

```txt
ng build --prod --base-href /apps/daskalos2/
```

In this example, the subpath is `apps/daskalos2`.
