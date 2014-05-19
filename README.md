Angular Slidezilla
========================

Angular Slidezilla is a pure angular slider directive which makes it incredibly simple to have reliable sliders in angular.

Talk is cheap: [See THE DEMO here](http://itslenny.github.io/angular-slider/).

##Installation

Dependencies: Angular

Download and include angular-slidezilla.js and pretty-slidezilla.css

Create an angular app and inject angular-slidezilla. That's about it.

**bower**
```bash
bower install angular-slidezilla
```

##Usage

**basic**
```html
<slider ng-model="slider1.val"></slider>
```
controller:
```js
    //set slider value as a number to have 1 slider
    //all properties default values
    $scope.slider1 = {val:5};
```

**static**
```html
<slider ng-model="slider2.val" min="-25" max="25" step="1"></slider>
```
controller:
```js
    //set slider value as a number to have 1 slider
    // properties defined in html
    $scope.slider2 = {val:-7};
```

**dynamic**
```html
<slider ng-model="slider3.val" min="slider3.min" max="slider3.max" step="slider3.step"></slider>
```
controller:
```js
    //set slider value as a number to have 1 slider
    // properties defined below
    $scope.slider3 = {
        val:5.5,
        min: 0,
        max: 10,
        step: 0.5
    };
```

**range**
```html
<slider ng-model="slider4.val"></slider>
```
controller:
```js
    //set value as an array to have 2 sliders
    $scope.slider4 = { val:[5,20] };
```

##Configuration

<table>
  <tbody>
    <tr>
      <td>Name</td>
      <td>Values</td>
      <td>Description</td>
      <td>Default</td>      
    </tr>
    <tr>
      <td>min</td>
      <td>variable or number (float)</td>
      <td>Min value of slider.</td>
      <td>0</td>
    </tr>
    <tr>
      <td>max</td>
      <td>variable or number (float)</td>
      <td>Max value of slider</td>
      <td>100</td>      
    </tr>
    <tr>
      <td>step</td>
      <td>variable or number (float)</td>
      <td>Step value of slider. Slider will increment by this value.</td>
      <td>5</td>      
    </tr>
  </tbody>
</table>


##Customization

Simply modify angular-slidezilla.css


