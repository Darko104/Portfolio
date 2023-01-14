window.onload = function () {
    pageManipulation.loadPage("home");
    $(document).on("click", ".page-link", function () {
        var pageName = $(this).data("page");

        pageManipulation.loadPage(pageName);
    })

    animation.animateIcon();
}
const pageManipulation = (() => {
    var pages = [
        {
            name: "home",
            pageName: "home.php",
            footerBottom: "0",
            id: "home-footer"
        },
        {
            name: "projects",
            pageName: "projects.php",
            footerBottom: "initial",
            id: "projects-footer"
        },
        {
            name: "about",
            pageName: "about.php",
            footerBottom: "0",
            id: "about-footer"
        }
    ]
    var images = [
    ]

    loadPage = (name) => {
        var result = pages.find(item => item.name === name);
        $("footer").css("bottom", result.footerBottom);
        $("footer").attr("id", result.id)
        $("main").load("views/"+result.pageName, function () {
            pageManipulation.loadProjects();
            animation.resetIterations();
            animation.animateIcon();
        });
    }
    loadProjects = () => {
        $.ajax({
            url: "data/projects.json",
            type: "POST",
            dataType : 'json',
            success: function (projects) {
                var html = "";

                for (var p of projects) {
                    var imagesObject = {
                        name: p.name,
                        images: p.images,
                        currentLoop: 0
                    }
                    images.push(imagesObject);

                    html += `
                    <div class="project">
                        <div class="project-thumbnail" style="background-image:url(assets/img/${p.images[0]})" data-name="${p.name}">
                            <p class="pt-arrow" data-name='${p.name}' data-direction="back"><i class="fa-solid fa-circle-arrow-left"></i></p>
                            <p class="pt-arrow" data-name='${p.name}' data-direction="forward"><i class="fa-solid fa-circle-arrow-right"></i></p>
                        </div>
                        <p class="project-title"><a href="${p.link}" target="_blank"><i class="fa-solid fa-link"></i>${p.name}</a></p>
                        <div class="project-technologies">`;
                            for (var tech of p.technologies) {
                                html += tech;
                            }
                        html += `
                        </div>
                        <div class="project-functionalities">
                            <p class="pf-title">Main functionalities:</p>
                            <ul class="functionalities-list">`
                                for (var func of p.functionalities) {
                                    html += "<li>"+func+"</li>";
                                }
                        html +=
                            `</ul>
                        </div>
                        <p class="project-description">
                            ${p.description}
                        </p>
                    </div>
                    `;
                }
                $("#projects-slide").html(html);
                $(".pt-arrow").click(function () {
                    var name = $(this).data("name");
                    var direction = $(this).data("direction");
                    pageManipulation.slideImage(name, direction, this);
                })
            }
        })
    }
    slideImage = (name, direction, arrow) => {
        var result = images.find(item => item.name === name);
        switch (direction) {
            case "back":
                result.currentLoop -= 1;
                break;
            case "forward":
                result.currentLoop += 1;
                break;
        }
        if (result.currentLoop < 0) result.currentLoop = result.images.length - 1;
        else if (result.currentLoop > result.images.length - 1) result.currentLoop = 0;


        $('.project-thumbnail[data-name='+name+']').fadeOut(300, function(){
            $('.project-thumbnail[data-name='+name+']').css("background-image", 'url(assets/img/'+ result.images[result.currentLoop] +')');
            $('.project-thumbnail[data-name='+name+']').fadeIn(300);
        })
    }

    return { loadPage, loadProjects, slideImage }
})();
const animation = (() => {
    var top = 0;
    // var left = 610;
    var currentIteration = 0;

    animateIcon = () => {
        var icons = $(".float-icon");
        $(icons[currentIteration]).animate({
            opacity: 1,
            top: top,
            // left: left
        }, 400, function () {
            top += 40;
            // left += 30;

            currentIteration += 1;
            if (currentIteration < icons.length) {
                animation.animateIcon()
            }
        })
    }
    resetIterations = () => {
        top = 0;
        left = 610;
        currentIteration = 0;
    }
    return { animateIcon, resetIterations }
})();