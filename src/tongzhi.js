export default{
    tongzhi(){
        document.addEventListener('plusready', function(){
            plus.push.setAutoNotification(false);   
              
           });
           function tongzhi(date,msg){
            var options = {cover:true}; 
            var str = date;    
            str += msg;
            plus.push.createMessage(str, options); 
          }
    }
    
}