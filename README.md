# VMAT - Virtual Memory Address Translation

## Overview

Welcome to the Virtual Memory Address Translation Simulator, a project designed to assist students in understanding and experimenting with virtual memory address translation in computer systems exams. This simulator was created by )[Phillip](https://github.com/Nidocq) and [I](https://github.com/MahmoodSeoud) to provide a hands-on and interactive learning experience for computer system students.

## Features

- **Exam Digitalization:** The simulator digitally recreates computer systems exams, allowing students to practice virtual memory address translation in a controlled environment.

- **Configurability:** The project offers configurability, enabling students to experiment with various types of assignments. This flexibility allows users to customize parameters such as page size, number of pages, and different memory management schemes.

- **Interactive Learning:** With a user-friendly interface, the simulator promotes interactive learning by visualizing the virtual memory address translation process step by step. Students can observe how different configurations impact the translation and gain a deeper understanding of the underlying concepts.

## Getting started
You can visit the app (here)[https://abdsecondhand.site/]
you can also clone the project and do:

```
npm i
npm run dev
```

## Pushing to production
1. Make your changes to the code
2. Fix all the warnings and Run `npm run build`. This will create a `dist` folder in the root directory
3. From here you will see a ìndex.html` file in the dist folder
```html
   <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vite + React + TS</title>
  <script type="module" crossorigin src="/assets/index-aeab2f56.js"></script>
  <link rel="stylesheet" href="/assets/index-b8a74404.css">
```
change the the `href`s and `crossorigin src` to have a relative link instead of absolute link (by changing the `/` to a `./`)
Here is an example
Make sure that the favicon is also present in the dist folder
```html
   <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="./sysMentorIcon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vite + React + TS</title>
  <script type="module" crossorigin src="./assets/index-aeab2f56.js"></script>
  <link rel="stylesheet" href="./assets/index-b8a74404.css">
```
4. Push the changes and the website will run automatically.

## Configuration Options

- **Page Size:** Set the size of memory pages to experiment with different granularity.
  
- **Number of TLB-sets:** Define the TLB-sets in the TLB table to observe the impact on translation.

- **Number of TLB-ways:** Define the TLB-ways in the TLB table to observe the impact on translation.

- **Virtual memory address bit length:** Choose between various memory management schemes (e.g., paging, segmentation) to understand their differences.

## Contribution Guidelines

We welcome contributions to enhance and expand the Virtual Memory Address Translation Simulator. If you have ideas for improvements or additional features, feel free to fork the repository and submit a pull request.

## Support and Feedback

For support or feedback, please open an issue on the [GitHub repository](https://github.com/MahmoodSeoud/VMAT/issues). We appreciate your input and are committed to making this simulator a valuable resource for students.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the simulator for educational purposes.

Happy learning!

