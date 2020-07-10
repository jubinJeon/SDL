
function toggleBtn(){
    $(".fnToggleBtn").click(function(){
        $(this).toggleClass('active').siblings(".fnToggleCon").toggle()
    })
}

function timeTosPop(el, msg, th = this){
    let html = '';
    html = `<div class="tossPop"><span>${msg}</span></div>`;
    console.log(this)
    console.log(this.clientInformation.appCodeName)
    console.log(th)
    $(el).after(html);
    $(el).siblings('.tossPop').fadeIn(1000);
    setTimeout(function(){
        $(el).siblings('.tossPop').fadeOut(1000, function(){
            $(el).siblings('.tossPop').remove() 
        });
	}, 2500);
}

function rollingFun(){
    var mainBanner = new Swiper('.mainBanner .swiper-container', {
        slidesPerView: 'auto',
        pagination: {
          el: '.mainBanner .swiper-pagination',
          type: 'fraction',
        },
      });
    var rollingSection = new Swiper('.rollingSection .swiper-container', {
        slidesPerView: 1.25,
        freeMode: true,
        centeredSlides: false,
        spaceBetween: 7,
        initialSlide:0,
    });
    

}

function rollingTabMenu(){
    var idx = $('.pageTabMenu li.active').index()
    var tabMenu = new Swiper('.pageTabMenu.swiper-container', {
          slidesPerView: 'auto',
          centeredSlides: true,
          centeredSlidesBounds: true,
          loop: false,
          initialSlide: idx
      });
    $('.pageTabMenu li').click(function(e){
        $('.pageTabMenu li').removeClass('active')
        $(this).addClass('active')
        var itemIndex = $( this ).index();
        tabMenu.slideTo(itemIndex);
    })
    
}

function detailLayout(){
    var mainMenuRolling = new Swiper('.mainMenu.swiper-container', {
        slidesPerView: 2.25,
        freeMode: true,
        centeredSlides: false,
        spaceBetween: 10,
        initialSlide:0,
    });

    let infoTitleTop = $('.detailInfo .infoRating').offset().top;
    $(window).scroll(function(){
        let winTop = $(this).scrollTop();
        let menuTop = $('.detailMenu').offset().top;
        if (winTop > infoTitleTop) {
			$('.detailLayout').addClass('fixedMenu')
        }else{
            $('.detailLayout').removeClass('fixedMenu')
        }
        if (winTop > menuTop - 50) {
            $('.detailMenu').addClass('fixedMenu')
		}else{
            $('.detailMenu').removeClass('fixedMenu')
        }
    });
    $('.menuListTab.fnLocation a').click(function(e){
        e.preventDefault()        
        let data_id = $(this).attr("href");
        let offsetTop = $(data_id).offset().top - 201; //50 42 41 68 = 201
        $('html, body').animate({scrollTop : offsetTop}, 400);
    })

    $('.listTitle').click(function(e){
        e.preventDefault()
        $(this).parent('li').toggleClass('hide')
    })
}

function tabMenu(){
    let tab = $('.fnTabMenu li')
    tab.click(function(e){
        e.preventDefault()
        let data_id = $(this).children('a').attr("href")
        $(this).siblings('li').removeClass('active')
        $(this).addClass('active')        
        $(data_id).addClass('active').siblings('.tebContent').removeClass('active')
        if($('.fnTextLength').length){
            msgLength()
        }
    })
}

function moreMsg(){
    $('.fnMoreBtn').click(function(){
        $(this).toggleClass('active')
        $(this).siblings('.fnMoreContent').toggleClass('active')
    })
}

function iconBtn(){
    $('.icon.like').click(function(e){
        e.preventDefault()
        $(this).toggleClass('active')
    })
}

function toggleList(){
    $('.fnToggleList').click(function(e){
        e.preventDefault();
        //$('.toggleList li').removeClass('active')
        
        $(this).parent('li').toggleClass('active')
        $(this).parent('li').siblings().removeClass('active')
    })
}

function msgLength(){
    $('.fnTextLength .fnTitleMsg').each(function(){
        if($(this).width() > $(document).width()){
            $(this).addClass('ellipsis')
        }
    })
    $('.fnTextLength .fnDescMsg').each(function(){
        const msgHeight = 34;
        if($(this).children('.desc').height() > msgHeight){
            $(this).addClass('ellipsis')
            $(this).siblings('.fnTitleMsg').addClass('ellipsis')
        }
    })
    $('.fnTextLength .fnTitleMsg.ellipsis').click(function(){
        $(this).toggleClass('viewAll')
        $(this).siblings('.fnDescMsg').toggleClass('viewAll')
    })
}

function ratingStar(){
    $(".fnRating .star").on('click',function(){
        var idx = $(this).index();
        $('.star').removeClass('on')
        for(var i = 0; i <= idx; i++){
            $('.star').eq(i).addClass('on')
        }
      });
}


$(document).ready(function(){
    toggleBtn()
    rollingFun()
    rollingTabMenu()
    tabMenu()
    moreMsg()
    toggleList()
    msgLength()
    ratingStar()
    if($('.detailLayout').length){
        detailLayout()
    }
    iconBtn()
})