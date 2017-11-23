/* @preserve
 *
 * angular-slidezilla
 * https://github.com/itslenny/angular-slidezilla
 *
 * Version: 0.1.4 - 11/23/2017
 * License: MIT
 */

'use strict';

//init module
angular.module('angular-slidezilla', [])

//config
    .constant('angularSlidezillaConfig', {
        min:0,
        max:100,
        step:5
    })

    //controller
    .controller('AngularSlidezillaController', ['angularSlidezillaConfig','$scope', function(angularSlidezillaConfig,$scope) {
        //set default scope values
        $scope.min=angularSlidezillaConfig.min || 0;
        $scope.max=angularSlidezillaConfig.max || 100;
        $scope.step=angularSlidezillaConfig.step || 5;
    }])

    //slider directive
    .directive('slider', function () {
        return {
            scope: {
                'model':'=ngModel'
            },
            restrict: 'E',
            require: ['ngModel'],
            controller: 'AngularSlidezillaController',
            link: function (scope, element, attrs, ctrls) {
                //process attributes and watch for changes
                if(attrs.min){
                    scope.min = scope.$parent.$eval(attrs.min);
                    scope.$parent.$watch(attrs.min, function(newVal) {
                        scope.min = newVal;
                        ctrls[0].$render();
                    });
                }
                if(attrs.max){
                    scope.max = scope.$parent.$eval(attrs.max);
                    scope.$parent.$watch(attrs.max, function(newVal) {
                        scope.max = newVal;
                        ctrls[0].$render();
                    });
                }
                if(attrs.step){
                    scope.step = scope.$parent.$eval(attrs.step);
                    scope.$parent.$watch(attrs.step, function(newVal) {
                        scope.step = newVal;
                        ctrls[0].$render();
                    });
                }

                //init dom objects
                var handles = element[0].querySelectorAll('.slider-handle');
                var track = element[0].querySelector('.slider-track');
                var selection = element[0].querySelector('.slider-selection');

                //drag state variable
                var dragging=false;

                //// model -> UI ////////////////////////////////////
                ctrls[0].$render = function () {
                    var hPos1,hPos2;
                    //ensure model value is in range
                    clampModelValue();
                    //update view value
                    ctrls[0].$setViewValue(scope.model);
                    //update display to match model value
                    if(typeof scope.model == 'number'){ // 25/75 = x / 100
                        hPos1 = 0;
                        hPos2 = 100 / (scope.max - scope.min) * (scope.model - scope.max) + 100;
                        angular.element(handles[0]).css('margin-left',hPos2+'%');
                        angular.element(handles[1]).addClass('hidden');
                    }else{
                        hPos1 = 100 / (scope.max - scope.min) * (scope.model[0] - scope.max) + 100;
                        hPos2 = 100 / (scope.max - scope.min) * (scope.model[1] - scope.max) + 100;
                        angular.element(handles[0]).css('margin-left',hPos1+'%');
                        angular.element(handles[1]).css('margin-left',hPos2+'%').removeClass('hidden');
                    }
                    angular.element(selection).css('margin-left',hPos1+'%').css('width',(hPos2-hPos1+1)+'%');
                };


                //// ui->model ////////////////////////////////////

                //bind mouse down event (track) - increment by step
                angular.element(track).bind('mousedown touchstart', function(e) {
                    // console.log('sqeek');
                    e.preventDefault();
                    if(dragging) return;
                    var newVal=scope.model;
                    var offsetX = e.offsetX || e.layerX;

                    if(typeof newVal == 'number') {
                        if (offsetX > handles[0].offsetLeft) {
                            newVal += scope.step;
                        } else {
                            newVal -= scope.step;
                        }
                    }else{
                        if(e.target == track && offsetX < handles[0].offsetLeft) {
                            newVal[0] -= scope.step;
                        }else if(e.target == track && offsetX > handles[1].offsetLeft) {
                            newVal[1] += scope.step;
                        }else{
                            if(e.target == selection && offsetX > e.target.offsetWidth/2){
                                newVal[1] -= scope.step;
                            }else{
                                newVal[0] += scope.step;
                            }
                        }
                    }
                    scope.$apply(function () {
                        scope.model=newVal;
                        ctrls[0].$render();
                    });
                });

                // Bind mousedown event (drag handles) -- start drag
                angular.element(handles).bind('mousedown touchstart', function(e) {
                    e.preventDefault();
                    var client;

                    if ( !!e.changedTouches ) {
                        if ( !!e.changedTouches[0] ) {
                            client = {
                                clientX: e.changedTouches[0].pageX,
                                clientY: e.changedTouches[0].pageY
                            }
                        }
                    } else {
                        client = {
                            clientX: e.clientX,
                            clientY: e.clientY
                        }
                    }

                    //store data about currently dragging handle
                    dragging={
                        sx: client.clientX - e.target.offsetLeft,
                        sy: client.clientY - e.target.offsetTop,
                        w: e.target.offsetWidth,
                        h: e.target.offsetHeight,
                        element: e.target,
                        index: e.target==handles[0] ? 0 : 1,
                        container: e.target.parentElement.getBoundingClientRect()
                    };

                    //listen for movement / mouse up
                    if ( !!e.touches ) {
                        angular.element(handles).bind('touchmove', mousemove);
                        angular.element(handles).bind('touchend', mouseup);
                    } else {
                        angular.element(document).bind('mousemove', mousemove);
                        angular.element(document).bind('mouseup', mouseup);
                    }
                });

                // mousemove event (document) -- update drag handle to position
                function mousemove(e) {
                    if(!dragging) return;

                    if ( !!e.targetTouches ) {
                        if ( !!e.targetTouches[0] ) {
                            dragging.y = e.targetTouches[0].pageY - (dragging.sy / 2);
                            dragging.x = e.targetTouches[0].pageX - (dragging.sx / 2);
                        }
                    } else {
                        dragging.y = e.clientY - dragging.sy;
                        dragging.x = e.clientX - dragging.sx;
                    }


                    //contain drag within track
                    if (dragging.x < 0) {
                        dragging.x = 0;
                    } else if (dragging.x > dragging.container.right - dragging.container.left) {
                        dragging.x = dragging.container.right - dragging.container.left;
                    }

                    //compute slider value based on handle position
                    var percentVal = Math.max(0,Math.min(100,parseInt((dragging.x / (dragging.container.right - dragging.container.left))*100)));
                    var normalizedVal = ((percentVal/100)*(scope.max - scope.min))+scope.min;
                    normalizedVal = parseFloat(normalizedVal.toFixed(3));
                    var rounded = roundToStep(normalizedVal,scope.step);
                    //pass value to model
                    scope.$apply(function () {
                        var setMVal=scope.model;
                        if(typeof setMVal == 'number') {
                            setMVal=rounded;
                        }else{
                            setMVal[dragging.index]=rounded;
                        }
                        scope.model=setMVal;
                        ctrls[0].$render();
                    });
                }

                // mouse up event (document) -- stop drag
                function mouseup(e) {
                    angular.element(handles).unbind('touchmove', mousemove);
                    angular.element(handles).unbind('touchend', mouseup);

                    angular.element(document).unbind('mousemove', mousemove);
                    angular.element(document).unbind('mouseup', mouseup);
                    dragging=false;
                }


                //// helpers ////////////////////////////////////

                //rounds value to step
                function roundToStep(val,step){
                    return (val >= 0 ) ? val + step/2 - (val+step/2) % step : val - step/2 - (val+step/2) % step;
                }

                //clamps model values. Keeps sliders within track and keeps them in index order
                function clampModelValue(){
                    if(typeof scope.model == 'number'){
                        if(scope.model > scope.max){
                            scope.model=scope.max;
                        }else if(scope.model < scope.min){
                            scope.model=scope.min;
                        }
                    }else{
                        var cv0,cv1;
                        if(scope.model[0] > scope.model[1]){
                            cv1 = scope.model[0];
                            cv0 = scope.model[1];
                            scope.model[0] = cv0;
                            scope.model[1] = cv1;
                        }
                        if(scope.model[0] > scope.max){
                            cv0 = scope.max;
                        }else if(scope.model[0] < scope.min){
                            cv0 = scope.min;
                        }
                        if(scope.model[1] > scope.max){
                            cv1 = scope.max;
                        }else if(scope.model[1] < scope.min){
                            cv1 = scope.min;
                        }
                        if(cv0 || cv1){
                            scope.model=[cv0 || scope.model[0],cv1 || scope.model[1]];
                        }
                    }
                }
            },
            template:'<div class="slider slider-horizontal"><div class="slider-track"><div class="slider-selection"></div><div class="slider-handle round"></div><div class="slider-handle round"></div></div><div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div><input type="text" class="slider"></div></div>',
            replace: true
        };
    });