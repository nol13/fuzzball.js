![](http://jpsierens.com/wp-content/uploads/2016/06/react-eco-wp.gif)

# webpack-react-redux
A boilerplate for playing around with react, redux and react-router with the help of webpack.

Contains: 

* a working example of a filterable table which you can play around with (look below).
* ES6 - 7 Support with Babel
* Redux dev tools to help you keep track of the app's state
* Routing
* hot module replacement support so you can change modules or react components without having to reload the browser
* a webpack production config so you can build the app and make it ready for production
* Sass support, just import your styles wherever you need them
* eslint to keep your js readable
* much more...



![](http://jpsierens.com/wp-content/uploads/2016/06/filterableTable-1.gif)


## Run the app

0. ```npm install```
0. ```npm start```

Once running, if you want to hide the redux dev monitor: ```CTRL+H```

Yes, it takes a while to load the first time you open the app.

### Is the hot module replacement really working?

Yup! Take a look:

![](http://jpsierens.com/wp-content/uploads/2016/06/HMR4.gif)

The app updates without the browser having to reload. You don't lose state!

## Build the app
```npm run build```

This will build the app into the "dist" directory in the root of the project. It contains the index.html along with the minified assets, ready for production.

![](http://i.imgur.com/uUg2A3S.png)

It should look something like the above image.

## I don't understand anything!

I went ahead and wrote a detailed series of posts on this project for you. I hope it helps you understand better:

* [configuring webpack](http://jpsierens.com/tutorial-react-redux-webpack/)
* [understanding the app, part 1 (index.js, store, reducers)](http://jpsierens.com/simple-react-redux-application/)
* [understanding the app, part 2 ( Root.js, router and the rest of the app)](http://jpsierens.com/simple-react-redux-application-2/)

## Why doesn't it have async?
To keep it unopinionated. You choose what async library you want. If you want to check out a full example with async in it, check this simple [todo-app](https://github.com/jpsierens/todo-app) that uses redux-sagas.
