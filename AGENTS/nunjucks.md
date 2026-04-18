# Nunjucks

- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [Nunjucks templating](https://mozilla.github.io/nunjucks/templating.html)
- [Nunjucks API docs](https://mozilla.github.io/nunjucks/api.html)

Example:

```js
{% extends "base.html" %}

{% block header %}
<h1>{{ title }}</h1>
{% endblock %}

{% block content %}
<ul>
  {% for name, item in items %}
  <li>{{ name }}: {{ item }}</li>
  {% endfor %}
</ul>
{% endblock %}
```

Set up Nunjucks and use the page template
Configure Nunjucks with paths to NHS.UK frontend, so Nunjucks knows where to find the NHS.UK frontend components, macros and page template:

For example:

nunjucks.configure([
'node_modules/nhsuk-frontend/dist/nhsuk/components',
'node_modules/nhsuk-frontend/dist/nhsuk/macros',
'node_modules/nhsuk-frontend/dist/nhsuk',
'node_modules/nhsuk-frontend/dist',
'<YOUR-VIEWS-FOLDER>'
])

## Setup

Use the LilyDesignSystem frontend template by adding the following at the top of your view file:

```js
{% extends "template.njk" %}
```

Go to the default page template example on the LilyDesignSystem Nunjucks project, then copy the Nunjucks code into your view file.

You may need to change the paths in the Nunjucks code to get the CSS, assets and JavaScript working.

## Adding a component

Go to any component page on the LilyDesignSystem Nunjucks project, then copy the Nunjucks macro code from the Nunjucks tab of any example.

For example, to add the breadcrumbs component to your page, copy the code from the Nunjucks tab in the first example on the breadcrumbs component page.

## Configuring a component

You can use options to configure how a component looks or behaves.

For example, use the text option to configure the text on buttons:

```
{{ button({
  text: "Example button text"
}) }}
```

To see the options for a component, go to any component page on the LilyDesignSystem Nunjucks project, select the Nunjucks tab of an example, then select Nunjucks macro options.

You must sanitise any HTML you pass in to Nunjucks macros you're using in your live application to protect your website against cross-site scripting (XSS) attacks.
