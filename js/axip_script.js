jQuery(function($){
    
    $(document).on('change',"#axip_education_level",function(){    
        var $t = $(this);
        if($t.val() >= 8){
            $("#axip_education_level_pair").show();
        }
        else{
            $("#axip_education_level_pair").hide(); 
        }
        $('.stepContainer>div').trigger('input');
    });
    
    $(document).on('change',"#axip_education_school",function(){        
        var $t = $(this);
        if($t.val() ==1){
            $("#axip_education_school_pair").show();

        }
        else{
            $("#axip_education_school_pair").hide();
            
        }
        $('.stepContainer>div').trigger('input');
    });

    $(document).on('change',"#axip_education_prior",function(){        
        var $t = $(this);
        if($t.val() ==1){
            $("#axip_education_prior_pair").show();
        }
        else{
            $("#axip_education_prior_pair").hide();
        }
        $('.stepContainer>div').trigger('input');
    });    

    $(document).on('change',"#axip_disability_status",function(){
        var $t = $(this);
        if($t.val() ==1){
            $("#axip_disability_status_pair").show();
        }
        else{
            $("#axip_disability_status_pair").hide();
            
        }
        $('.stepContainer>div').trigger('input');
    });  
    
    
});