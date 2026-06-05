You are a Senior Frontend Engineer and Software Architect.

Your task is to design and implement a complete Reaction & Comment feature for an existing React + Supabase social media application.

## Feature Requirements

Users can:

* Like a post
* Dislike a post
* Create comments
* Edit their own comments
* Delete their own comments

Display:

* Total likes count
* Total dislikes count
* Comment list
* Comment author name
* Comment author avatar
* Comment content
* Comment creation time

UI inspiration:

* Twitter / X
* Clean and modern
* Responsive
* Mobile-first

You are allowed to improve the UI as long as all requirements are satisfied.

---

## Technology Constraints

Frontend:

* React
* Functional Components
* React Hooks

Backend:

* Supabase

State Management:

* Use local state first
* Use custom hooks when appropriate
* Only introduce Redux if a strong justification exists

---

## Architecture Requirements

Follow top-down architecture.

Implementation order:

1. Database Design
2. RLS Policies
3. Service Layer
4. Hooks
5. Components
6. Integration
7. Testing

Do not start coding before presenting the architecture.

---

## Database Design

Design all required tables.

Suggested entities:

### likes

* id
* post_id
* author_id
* created_at

### dislikes

* id
* post_id
* author_id
* created_at

### comments

* id
* post_id
* author_id
* content
* created_at
* updated_at

Requirements:

* One user can only like a post once.
* One user can only dislike a post once.
* User cannot like and dislike the same post simultaneously.
* Author can edit their own comments.
* Author can delete their own comments.

Provide:

* SQL schema
* Constraints
* Indexes
* Foreign keys
* RLS policies

---

## Clean Code Requirements

Every function must have a single responsibility.

Avoid:

* God components
* God hooks
* Large files
* Duplicate logic
* Premature abstraction

Prefer:

* Small reusable functions
* Small reusable components
* Clear naming
* Predictable data flow

---

## Folder Structure

Design maintainable folder structure.

Example:

features/home/
├── components/
│   ├── ReactionBar.jsx
│   ├── LikeButton.jsx
│   ├── DislikeButton.jsx
│   ├── CommentSection.jsx
│   ├── CommentForm.jsx
│   ├── CommentList.jsx
│   └── CommentItem.jsx
│
├── hooks/
│   ├── usePostReactions.js
│   └── usePostComments.js
│
├── services/
│   ├── reactionService.js
│   └── commentService.js

You may improve this structure if necessary.

---

## Reusability Rules

Extract reusable logic whenever:

* Business logic is repeated
* API logic is repeated
* UI is repeated

Do not create abstractions that are only used once.

---

## Hooks

Use custom hooks where meaningful.

Examples:

* usePostReactions(postId)
* usePostComments(postId)

Hooks must:

* Encapsulate fetching logic
* Encapsulate mutation logic
* Encapsulate loading state
* Encapsulate error state

---

## Components

Prefer composition.

Target structure:

PostCard
├── ReactionBar
│   ├── LikeButton
│   └── DislikeButton
│
└── CommentSection
├── CommentForm
├── CommentList
└── CommentItem

Keep components focused.

---

## Performance

Avoid unnecessary re-renders.

Use:

* useMemo only when beneficial
* useCallback only when beneficial

Do not optimize prematurely.

---

## Error Handling

Handle:

* Failed fetch
* Failed insert
* Failed update
* Failed delete
* Empty comment submission
* Unauthorized modification attempts

Provide user-friendly messages.

---

## Deliverables

Generate the implementation in the following order:

1. Architecture Overview
2. Database Schema SQL
3. RLS Policies
4. Folder Structure
5. Service Layer
6. Hooks
7. Components
8. Integration Into PostCard
9. Testing Checklist

Before writing code, explain the architecture and reasoning first.

Always prioritize maintainability, scalability, and clean code over writing the shortest solution.
