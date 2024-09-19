


# SimpliCSS

![SimpliCSS Logo](https://raw.githubusercontent.com/baidou5/SimpliCSS/main/bgs.jpg)

Created by Abdellah Baidou  
Contact: +212 661-176711  
Email: baidou.abd@gmail.com

**SimpliCSS** is a lightweight, utility-first CSS framework designed to simplify the development of modern, responsive websites. It aims to be an easy-to-use alternative to more complex frameworks, offering a streamlined and more intuitive approach to styling. While inspired by popular frameworks, SimpliCSS focuses on simplicity, efficiency, and flexibility.

## Key Features
- **Utility-First Approach**: Use concise utility classes to build layouts quickly without writing custom CSS.
- **Simplified Class Names**: Designed to be intuitive and easy to remember, making development faster and more efficient.
- **Responsive Design**: Built-in responsive utilities that ensure your websites adapt beautifully to different screen sizes, without extra effort.
- **Lightweight Framework**: Only includes essential features, allowing you to keep your projects fast and lean, without unnecessary bloat.
- **Customizability**: Easily extend and modify the framework to fit your specific project requirements. The `simpliCSS.css` file is structured for easy customization.
- **Flexbox and Grid Support**: Built-in utilities for modern layouts using Flexbox and Grid, simplifying complex layout designs.

## Installation
To get started with SimpliCSS, you can either download the `SimpliCSS.css` file from the repository or use the CDN link.

### Using the CDN:
Add the following link to your HTML's `<head>` section to include SimpliCSS via CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/baidou5/SimpliCSS@main/SimpliCSS/SimpliCSS.css">
```

### Local Installation:
Alternatively, you can clone the repository from GitHub:

```bash
git clone https://github.com/baidou5/SimpliCSS.git
```

Then, include the `simpliCSS.css` file in your project:

```html
<link rel="stylesheet" href="path/to/SimpliCSS.css">
```

## Usage
SimpliCSS utilizes simple utility classes to style your elements. You can directly apply these classes to your HTML elements to quickly create layouts and style your content.

### Example Usage:
```html
<div class="bg-blue text-white p-2 rounded-md shadow-md">
 This is a simple card component!
</div>
```

This example creates a card with a blue background, white text, padding, rounded corners, and a shadow.

### Responsive Classes:
SimpliCSS includes responsive utilities to control how elements behave on different screen sizes. For example:

```html
<div class="bg-light md:bg-dark lg:bg-black">
 Responsive background color change!
</div>
```

Here, the background color will change based on the screen size (`md` for medium screens and `lg` for large screens).

## Example Code
Here's a basic example of a webpage using SimpliCSS:

```html
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>SimpliCSS Example</title>
 <link rel="stylesheet" href="simpli.css">
</head>
<body>
 <div class="flex justify-center items-center h-screen bg-light">
   <div class="bg-blue text-white p-3 rounded-lg shadow-lg">
     Welcome to SimpliCSS!
   </div>
 </div>
</body>
</html>
```

This creates a simple centered message with a blue background and a white text box.

## Customization
SimpliCSS is designed with simplicity in mind, but it's also fully customizable. You can modify the default utilities, add new ones, or remove anything unnecessary to better suit your project.

To customize the framework:
1. Open `SimpliCSS.css` in your preferred code editor.
2. Adjust the styles, breakpoints, or add your own custom utility classes.
3. Save your changes and see the updates in your project instantly.

## Roadmap
Here are some of the planned features and improvements for SimpliCSS:
- **Component Support**: Include ready-made UI components (like buttons, cards, etc.) for even faster development.
- **Dark Mode Support**: Add utilities for dark mode styling.
- **Advanced Animations**: Include a utility-based animation system for adding transitions and effects.
- **More Flexibility**: Continue simplifying the customization process, allowing users to build their own version of SimpliCSS with ease.

## Contributing
Contributions are more than welcome! If you’d like to help improve SimpliCSS, feel free to fork the repository, submit issues, or open pull requests. Any improvements, suggestions, or bug reports are greatly appreciated.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.
