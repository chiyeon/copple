**cobble** is the demo project for and the experimental node framework that compiles content from data rather than dynamically rendering it. This approach takes static content, for example a `json` of programming projects, and compiles an `index.html` with html definitions for all of the described content. This of course has the major drawback of no dynamically rendered content. Basic counter applications like those found in Getting Started with Vue or React tutorials will be a lot harder to achieve here. However, the benefit is that the final output is a fully functioning HTML/CSS file with *no javascript dependency*.

Component definitions are defined as "templates" (not to be confused with the `<template>` tag) stored in html files. To assign content, `${props.CONTENT}` can be passed in as the data. See the example below.

```html
<div class="example-template">
    <h1 class="main-header">${props.title}</h1>
    <p class="date">${props.date}</p>
</div>
```

On compilation, the `${props.CONTENT}` is automatically replaced with proper content supplied in `build.js`.