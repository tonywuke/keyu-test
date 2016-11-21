angular.module('app.controllers', [])

.controller('homeTabDefaultPageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    $scope.color= 'red';
    $scope.cards=[
        {name:'wuke' , editDate:'2016/11/16', title:'寻找另一个地方',likeNum: 5, commentNum:8 },
        {name:'dory' , editDate:'2016/05/16', title:'发现新大陆',likeNum: 1, commentNum:0 }
    ]


}])

.controller('findTabDefaultPageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('mineTabDefaultPageCtrl', ['$scope', '$stateParams','$http','$state','$rootScope',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state,$rootScope) {
    if(!$rootScope.isLogin)//判断是否登录
        $scope.user={phonenumber:'点击登录/注册'};
    else
        $scope.user={phonenumber:localStorage.getItem("phonenumber")};

    $scope.infoClick= function(){
        $state.go('userInfoPage',{phonenumber : localStorage.getItem("phonenumber")});//跳转个人信息页面
    }

    $scope.signout= function(){
        localStorage.removeItem("phonenumber");
        $rootScope.isLogin=false;
        $state.go('tabsController.homeTabDefaultPage');
    }

}])

.controller('loginPageCtrl', ['$scope', '$stateParams','$http','$state','$rootScope',"$ionicPopup","$timeout", // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state,$rootScope,$ionicPopup,$timeout) {
    $scope.login= function(){
        $http.post($rootScope.urlAddress+'/users/login',$scope.user)
            .success(function (data, status, headers, config) {
                console.log(data);
                if(data.isLoginSuccess==true){
                    $rootScope.isLogin=true;
                    localStorage.setItem("phonenumber", $scope.user.phonenumber);
                    var loginPopup = $ionicPopup.show({
                        title: '登录成功'
                    });
                    $timeout(function() {
                        loginPopup.close(); //由于某种原因2秒后关闭弹出
                    }, 1000);
                    $state.go('tabsController.mineTabDefaultPage');
                }else {
                    $rootScope.isLogin=false;
                    $scope.isLoginFailure=true;
                }
            });
    }
}])

.controller('signupPageCtrl', ['$scope', '$stateParams', '$http','$state','$ionicPopup','$ionicHistory','$timeout','$rootScope',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state,$ionicPopup,$ionicHistory,$timeout,$rootScope) {
   $scope.signup= function(){
       $http.post($rootScope.urlAddress+'/users/signup',$scope.user)
           .success(function (data, status, headers, config) {
               console.log(data);
               var sigupPopup = $ionicPopup.show({
                   title: '注册成功',
                   subTitle: '请登录'
               });
               $timeout(function() {
                   sigupPopup.close(); //由于某种原因2秒后关闭弹出
               }, 1000);
               $state.go('loginPage');
           });
   }
}])



.controller('userInfoPageCtrl', ['$scope', '$stateParams', '$http','$state','$rootScope','$ionicActionSheet',
              '$cordovaImagePicker','$cordovaCamera','$cordovaFileTransfer',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state,$rootScope,$ionicActionSheet,
            $cordovaImagePicker,$cordovaCamera,$cordovaFileTransfer) {
    $scope.user = {phonenumber:$stateParams.phonenumber};

    $http.get($rootScope.urlAddress+'/users/get-user-info',{params: $scope.user} )
        .success(function (data, status, headers, config) {
            console.log(data);
            $scope.user=data;
        });

    $scope.saveUserInfo= function(){
        $http.post($rootScope.urlAddress+'/users/save-user-info',$scope.user)
            .success(function (data, status, headers, config) {
                console.log(data);
                $state.go('tabsController.mineTabDefaultPage');
            });
    }

    $scope.uploadHeadImg= function(){
      $ionicActionSheet.show({
          buttons: [
            { text: '拍照' },
            { text: '从相册上传' }
          ],
          cancelText: '取消',
          cancel: function() {
              return true;
          },
          buttonClicked: function(index) {
              switch (index){
                  case 0:
                      takePhoto();
                      break;
                  case 1:
                      pickImage();
                      break;
                  default:
                      break;
              }
              return true;
          }
      });
    }


    //image picker
    var pickImage = function () {

      var options = {
          //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
          quality: 100,                                            //相片质量0-100
          destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
          sourceType: 0,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
          allowEdit: false,                                        //在选择之前允许修改截图
          encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
          mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
          cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false                                   //保存进手机相册
      };
      $cordovaCamera.getPicture(options).then(function (imageData) {
          $scope.headImgSrc=imageData;
          upImage(imageData);
      }, function (err) {

      });
    }


    var takePhoto = function () {
        var options = {
            //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
            quality: 100,                                            //相片质量0-100
            destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
            sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
            allowEdit: false,                                        //在选择之前允许修改截图
            encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
            mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
            cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false                                   //保存进手机相册
        };
        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.headImgSrc=imageData;
            upImage(imageData);
        }, function (err) {

        });

    }

    //图片上传upImage（图片路径）
    //http://ngcordova.com/docs/plugins/fileTransfer/  资料地址
    var upImage = function (imageUrl) {
        document.addEventListener('deviceready', function () {
            var url = $rootScope.urlAddress+'/files/upload';
            var options = new FileUploadOptions();
            var params = {
               phonenumber: '1111',
               type: 'headImg'
            };
            options.params = params;

            $cordovaFileTransfer.upload(url, imageUrl, options)
              .then(function (result) {
                  console.log(result);
                  alert(JSON.stringify(result.response));
                  alert("success");
                  alert(result.message);
              }, function (err) {
                  alert(JSON.stringify(err));
                  alert(err.message);
                  alert("fail");
              }, function (progress) {
                  console.log(progress);
                  // constant progress updates
              });

        }, false);
    }

}])


.controller('verifyMailboxPageCtrl', ['$scope', '$stateParams','$interval','$http', '$ionicPopup', '$timeout','$state','$rootScope',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$interval,$http,$ionicPopup,$timeout,$state,$rootScope) {
    $scope.isSendCode=false;
    $scope.sendCodeBtnText='发送验证码';
    $scope.sendCode= function() {
        var second=60;
        var user = {
            phonenumber:localStorage.getItem("phonenumber"),
            email:$scope.email
        };

        $http.post($rootScope.urlAddress+'/users/send-verify-mail',user)
            .success(function (data, status, headers, config) {
                if(data=='success') {
                    var timer = $interval(function () {
                        if (second <= 0) {
                            $interval.cancel(timer);
                            second = 60;
                            $scope.sendCodeBtnText = "重发验证码";
                            $scope.isSendCode = false;
                        } else {
                            $scope.sendCodeBtnText = second + "秒后可重发";
                            $scope.isSendCode = true;
                            second--;
                        }
                    }, 1000, 100);
                }else if(data=='exist'){
                    var sendCodePopup = $ionicPopup.show({
                        title: '邮箱已被验证'
                    });
                    $timeout(function() {
                        sendCodePopup.close(); //1秒后关闭弹出
                    }, 1000);
                }
            });

    }

    $scope.verifyMailbox= function() {
        var user = {
            phonenumber:localStorage.getItem("phonenumber"),
            email:$scope.email,
            emailCode:$scope.emailCode
        };
        $http.post($rootScope.urlAddress+'/users/verify-mailbox',user)
            .success(function (data, status, headers, config) {
                console.log(data);
                if(data=='success'){
                    var verifyMailboxPopup = $ionicPopup.show({
                        title: '验证成功'
                    });
                    $timeout(function() {
                        verifyMailboxPopup.close(); //1秒后关闭弹出
                    }, 1000);
                    $state.go('tabsController.mineTabDefaultPage');
                }else if(data=='timeout'){
                    var verifyMailboxPopup = $ionicPopup.show({
                        title: '验证码失效'
                    });
                    $timeout(function() {
                        verifyMailboxPopup.close();
                    }, 1000);
                }else if(data=='incorrect'){
                    var verifyMailboxPopup = $ionicPopup.show({
                        title: '验证码不正确'
                    });
                    $timeout(function() {
                        verifyMailboxPopup.close();
                    }, 1000);
                }else if(data=='mismatch'){
                    var verifyMailboxPopup = $ionicPopup.show({
                        title: '当前输入邮箱与验证邮箱不匹配'
                    });
                    $timeout(function() {
                        verifyMailboxPopup.close();
                    }, 1000);
                }

            });
    }
}])


.controller('editCardPageCtrl', ['$scope', '$stateParams','$http','$ionicPopup','$timeout','$state','$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $ionicPopup, $timeout, $state,$rootScope) {

    $scope.publish= function() {
        var card ={
            phonenumber:localStorage.getItem("phonenumber"),
            name:'wuke',
            likeNum:0,
            commentNum:0,
            hidden:false,
            title:$scope.title,
            body:$scope.body
        };

        $http.post($rootScope.urlAddress+'/cards/publish',card)
            .success(function (data, status, headers, config) {
                console.log(data);
                if(data=='success'){
                    var publishPopup = $ionicPopup.show({
                        title: '发布成功'
                    });
                    $timeout(function() {
                        publishPopup.close(); //1秒后关闭弹出
                    }, 1000);
                    $state.go('tabsController.homeTabDefaultPage');
                }
            });

    }

}])

.controller('viewCardPageCtrl', ['$scope', '$stateParams','$http','$ionicPopup','$timeout','$state','$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $ionicPopup, $timeout, $state,$rootScope) {



}])
