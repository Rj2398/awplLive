"use strict";
jQuery(document).ready(function($){
    // document start

    const sideBar = document.querySelector(".sidebar");
    if(sideBar){
        document.querySelector(".docpnl-hdr-toggler").addEventListener("click",function(){
            sideBar.classList.add("fixed");
        });
    }
    if( document.querySelector(".sidebar-close")){
        document.querySelector(".sidebar-close").addEventListener("click",function(){
            sideBar.classList.remove("fixed");
        });
    };
    const date = new Date();
    const getFullYr = date.getFullYear();
    if($(".curryr").length){
        document.querySelector(".curryr").innerHTML=getFullYr;
    };
    if($("[data-fancybox]").length){
        Fancybox.bind("[data-fancybox]");
    };
    
    if($(".my-appointments-tab-head ul li").length){
        function updateTabBg(){
            let $activeTab = $('.my-appointments-tab-head ul li.active');
            let left = $activeTab.position().left;
            let width = $activeTab.outerWidth();
            $('.tab-bg').css({
              left: left,
              width: width
            });
        };
        $(".search-filter-inr-wrp .datepicker-wrp").hide();
        updateTabBg();
        $('.my-appointments-tab-head ul li').on('click', function(){
            $('.my-appointments-tab-head ul li').removeClass('active');
            $(this).addClass('active');
            updateTabBg();
        });
        const $tab = $('.my-appointments-tab-head ul li');
        $tab.on('click', function(){
            const $this = $(this);
            const $tabContent = $this.next('.tab-content');
            const $tabContentActive = $('.tab-content.active');
            $tabContentActive.removeClass('active');
            $tabContent.addClass('active');
            $tabContent.css('display','block');
        });
    };


    setInterval(() => {
        if($(".myapintmnt-content-tab.upcoming").hasClass("active")){
            $(".search-filter-inr-wrp .formfield").show();
            $(".search-filter-inr-wrp .past-patient-filter-wrp").hide();
            $(".search-filter-inr-wrp .datepicker-wrp").hide();
        }else if($(".myapintmnt-content-tab.cancelled").hasClass("active")){
            $(".search-filter-inr-wrp .past-patient-filter-wrp").hide();
            $(".search-filter-inr-wrp .datepicker-wrp").show();
            $(".search-filter-inr-wrp .formfield").show();
        }else{
            $(".search-filter-inr-wrp .formfield").hide();
            $(".search-filter-inr-wrp .datepicker-wrp").show();
            $(".search-filter-inr-wrp .past-patient-filter-wrp").show();
        };
    }, 100);








    $(".my-appointments-tab-head ul li").not(".tab-bg").each(function () {
        const tabText = $(this).text().trim().replace(/[\\/]/g, "").replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/-+/g, "-").toLowerCase();
        $(this).attr("data-filter", "." + tabText);
    });
    $(".myapintmnt-content-tab").hide().removeClass("active");
    $(".myapintmnt-content-tab:first").show().addClass("active");
    $(".my-appointments-tab-head ul li").not(".tab-bg").on("click", function () {
        $(".myapintmnt-content-tab").removeClass("active");
        $(".my-appointments-tab-head ul li").not(".tab-bg").removeClass("active");
        $(this).addClass("active");
        const filterValue = $(this).data("filter");
        $(".myapintmnt-content-tab").fadeOut(300, function () {
            $(".myapintmnt-content-tab" + filterValue).fadeIn(300).addClass("active");
        });
    });



    // document.querySelectorAll("[type='submit']").forEach(btn => {
    //     btn.addEventListener("click", function (e) {
    //         e.preventDefault();
    //     });
    // });   
    
    $(".loginBtn").on("click", function(e) {
        e.preventDefault(); 
        const password = $("#password").val();
        if ($.trim(password) === "") {
            return false;
        } else {
            if($("#congratulations").length){
                $("#congratulations").modal("show");
            }else if($("#loginSuccessful").length){
                $("#loginSuccessful").modal("show");
            };
        };
    });
    

    if($('.datepicker-wrp').length){
        function getDaysInMonth(year, month) {
            return new Date(year, month + 1, 0).getDate();
        }
        function getFirstDayOfMonth(year, month) {
            return new Date(year, month, 1).getDay();
        }
        function formatDate(year, month, day) {
            let mm = String(month + 1).padStart(2, '0');
            let dd = String(day).padStart(2, '0');
            return `${mm}-${dd}-${year}`;
        }
        function parseDate(str) {
            const [mm, dd, yyyy] = str.split('-');
            return {
                year: parseInt(yyyy, 10),
                month: parseInt(mm, 10) - 1,
                day: parseInt(dd, 10)
            };
        }
        function isSameDate(d1, d2) {
            return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day;
        }
        function isBefore(d1, d2) {
            const date1 = new Date(d1.year, d1.month, d1.day);
            const date2 = new Date(d2.year, d2.month, d2.day);
            return date1 < date2;
        }
        (function () {
            const dateRangeInput = document.getElementById('dateRangeInput');
            const calendarPopup = document.getElementById('calendarPopup');
            const fromBtn = document.getElementById('fromBtn');
            const toBtn = document.getElementById('toBtn');
            const fromDateLabel = document.getElementById('fromDateLabel');
            const toDateLabel = document.getElementById('toDateLabel');
            const prevMonthBtn = document.getElementById('prevMonthBtn');
            const nextMonthBtn = document.getElementById('nextMonthBtn');
            const monthYearLabel = document.getElementById('monthYearLabel');
            const calendarGrid = document.getElementById('calendarGrid');
            let activeField = "from";
            const today = new Date();
            let fromDate = {
                year: today.getFullYear(),
                month: today.getMonth(),
                day: today.getDate()
            };
            let toDate = { ...fromDate };
            let currentYear = fromDate.year;
            let currentMonth = fromDate.month;
            function updateLabels() {
                fromDateLabel.textContent = formatDate(fromDate.year, fromDate.month, fromDate.day);
                toDateLabel.textContent = formatDate(toDate.year, toDate.month, toDate.day);
                if (activeField === "from") {
                    fromBtn.classList.add('active');
                    toBtn.classList.remove('active');
                } else {
                    fromBtn.classList.remove('active');
                    toBtn.classList.add('active');
                }
            };
            function renderCalendar() {
                calendarGrid.innerHTML = '';
                const headerRow = document.createElement('tr');
                const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                daysOfWeek.forEach(day => {
                    const th = document.createElement('th');
                    th.textContent = day;
                    headerRow.appendChild(th);
                });
                calendarGrid.appendChild(headerRow);
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                monthYearLabel.textContent = monthNames[currentMonth] + ' ' + currentYear;

                const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
                const daysInThisMonth = getDaysInMonth(currentYear, currentMonth);
                let daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
                let row = document.createElement('tr');
                let dayCellCount = 0;
                for (let i = 0; i < firstDayIndex; i++) {
                    const td = document.createElement('td');
                    td.classList.add('outside-month');
                    td.textContent = (daysInPrevMonth - firstDayIndex + i + 1).toString();
                    row.appendChild(td);
                    dayCellCount++;
                }
                for (let d = 1; d <= daysInThisMonth; d++) {
                    if (dayCellCount === 7) {
                        calendarGrid.appendChild(row);
                        row = document.createElement('tr');
                        dayCellCount = 0;
                    }

                    const td = document.createElement('td');
                    td.textContent = d.toString();
                    let thisDay = { year: currentYear, month: currentMonth, day: d };
                    if (isSameDate(thisDay, fromDate) || isSameDate(thisDay, toDate)) {
                        td.classList.add('selected');
                    }
                    if (isBefore(fromDate, thisDay) && isBefore(thisDay, toDate)) {
                        td.classList.add('in-range');
                    }
                    td.addEventListener('click', () => {
                        if (activeField === "from") {
                            fromDate = thisDay;
                            activeField = "to";
                        } else {
                            toDate = thisDay;
                        };
                        if (isBefore(toDate, fromDate)) {
                            let temp = fromDate;
                            fromDate = toDate;
                            toDate = temp;
                        }
                        updateLabels();
                        renderCalendar();
                    });
                    row.appendChild(td);
                    dayCellCount++;
                }
                let dayNextMonth = 1;
                while (dayCellCount < 7) {
                    const td = document.createElement('td');
                    td.classList.add('outside-month');
                    td.textContent = (dayNextMonth++).toString();
                    row.appendChild(td);
                    dayCellCount++;
                }
                calendarGrid.appendChild(row);
            }
            prevMonthBtn.addEventListener('click', () => {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                renderCalendar();
            });
            nextMonthBtn.addEventListener('click', () => {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                renderCalendar();
            });
            fromBtn.addEventListener('click', () => {
                activeField = "from";
                updateLabels();
                renderCalendar();
            });
            toBtn.addEventListener('click', () => {
                activeField = "to";
                updateLabels();
                renderCalendar();
            });
            dateRangeInput.addEventListener('click', (e) => {
                const rect = dateRangeInput.getBoundingClientRect();
                // calendarPopup.style.top = (window.scrollY + rect.bottom) + "px";
                // calendarPopup.style.left = rect.left + "px";
                if (calendarPopup.style.display === 'none') {
                    calendarPopup.style.display = 'block';
                } else {
                    calendarPopup.style.display = 'none';
                }
            });
            function updateInput() {
                dateRangeInput.value =
                    formatDate(fromDate.year, fromDate.month, fromDate.day) + ' - ' +
                    formatDate(toDate.year, toDate.month, toDate.day);
            }
            const originalUpdateLabels = updateLabels;
            updateLabels = function () {
                originalUpdateLabels();
                updateInput();
            };
            updateLabels();
            renderCalendar();
        })();   
    };
      

    document.querySelectorAll("input[type='range']").forEach(range => {
        range.addEventListener("input", function() {
            const value = this.value;
            const min = this.min ? parseFloat(this.min) : 0;
            const max = this.max ? parseFloat(this.max) : 100;
            const percentage = ((value - min) / (max - min)) * 100;
            this.style.background = `linear-gradient(to right, var(--theme-clr-2) ${percentage}%, #e1e1e1 ${percentage}%)`;
        });
    });
      
      
    if($(".past-patient-filter-wrp").length){
        $(".past-patient-filter-wrp > button").on("click", function(){
            $(".filter-options-drpdn").toggleClass("active")
        });
    };

    if($(".bulk-actions button").length){
        $(".bulk-actions button label").on("click", function(){
            $(".bulk-actions button").removeClass("active");
            $(this).parent().toggleClass("active");
        });
    };


    const reminderPopEl = document.getElementById('reminderPop');
    if(reminderPopEl){
        const reminderPop = new bootstrap.Modal(reminderPopEl);
        setTimeout(function() {
            reminderPop.show();
        }, 3000);
    };


    if(document.querySelector(".calender")){
        let currentDate = new Date();
        let selectedDate = null;
        let selectedTime = null;
        const monthYearTitle = document.querySelector('.calender-monthyear h2');
        const monthDaysEl = document.querySelector('.moth-days-wrp');
        const prevMonthBtn = document.querySelector('.prev-month');
        const nextMonthBtn = document.querySelector('.next-month');
        const bookBtn = document.querySelector('.book-btn');
        const selectedDateEl = document.querySelector('.selected-date');
        function getOrdinalSuffix(n) {
          if (n > 3 && n < 21) return n + 'th';
          switch (n % 10) {
            case 1: return n + 'st';
            case 2: return n + 'nd';
            case 3: return n + 'rd';
            default: return n + 'th';
          }
        }
        function formatDate(date) {
          let weekday = date.toLocaleDateString('default', { weekday: 'long' });
          let day = getOrdinalSuffix(date.getDate());
          let month = date.toLocaleString('default', { month: 'long' });
          return weekday + ', ' + day + ' ' + month;
        }
        function renderCalendar(date) {
          monthDaysEl.innerHTML = '';
          const year = date.getFullYear();
          const month = date.getMonth();
          monthYearTitle.textContent = date.toLocaleString('default', { month: 'long' }) + ' ' + year;
          let firstDay = new Date(year, month, 1);
          let startDay = firstDay.getDay();
          startDay = (startDay === 0) ? 6 : startDay - 1;
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          for (let i = 0; i < startDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.textContent = '';
            monthDaysEl.appendChild(emptyDiv);
          }
          for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;
            dayDiv.addEventListener('click', function(){
              document.querySelectorAll('.moth-days-wrp div').forEach(el => el.classList.remove('selected'));
              dayDiv.classList.add('selected');
              selectedDate = new Date(year, month, i);
              selectedDateEl.innerHTML = formatDate(selectedDate);
            });
            monthDaysEl.appendChild(dayDiv);
          }
        }
        renderCalendar(currentDate);
        prevMonthBtn.addEventListener('click', function(){
          currentDate.setMonth(currentDate.getMonth() - 1);
          renderCalendar(currentDate);
        });
        nextMonthBtn.addEventListener('click', function(){
          currentDate.setMonth(currentDate.getMonth() + 1);
          renderCalendar(currentDate);
        });
        document.querySelectorAll('.available-time').forEach(slot => {
          if (!slot.classList.contains('booked-time')) {
            slot.addEventListener('click', function(){
              document.querySelectorAll('.available-time').forEach(s => s.classList.remove('selected'));
              slot.classList.add('selected');
              selectedTime = slot.textContent;
            });
          }
        });
        bookBtn.addEventListener('click', function(){
          if (!selectedDate) {
            alert('Please select a date.');
            return;
          }
          if (!selectedTime) {
            alert('Please select a time slot.');
            return;
          }
        //   alert('Appointment booked on ' + formatDate(selectedDate) + ' at ' + selectedTime);
          document.querySelector(".bookingDateTime").innerHTML = formatDate(selectedDate) + ' at ' + selectedTime;
        });
    };


    $('.input-pass-field').each(function(){
        const $wrapper = $(this);
        const $input = $wrapper.find("input");
        const $eyeOpen = $wrapper.find("span.eye-open");
        const $eyeClose = $wrapper.find("span.eye-close");
        $eyeClose.on("click", function(){
            $input.attr("type", "text");
            $eyeOpen.show();
            $eyeClose.hide();
        });
        $eyeOpen.on("click", function(){
            $input.attr("type", "password");
            $eyeClose.show();
            $eyeOpen.hide();
        });
    });

    const inputs = document.querySelectorAll('.otp-container input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length > 1) {
                input.value = input.value.slice(0, 1);
            }
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });
   

    const drpdnList = document.querySelectorAll(".medicine-wrp-single .formfield .cstm-drpdn li")
    drpdnList.forEach((el, i) => {
        if(el){
            el.addEventListener("click",function(){
                const listVal = el.textContent;
                this.parentElement.parentElement.parentElement.querySelector("input").value = listVal;
            })
        };
    });
    

    if(document.querySelector('.panel-footer')){
        function adjustFooter() {
            const footer = document.querySelector('.panel-footer');
            const content = document.querySelector('body');
            const totalContentHeight = content.offsetHeight;
            const viewportHeight = window.innerHeight;
            if (totalContentHeight < viewportHeight) {
                footer.classList.add('active');
                footer.style.position = 'fixed';
                footer.style.bottom = '0';
                footer.style.left = '0';
                footer.style.width = '100%';
                content.style.paddingBottom = footer.offsetHeight + 'px';
            } else {
                footer.style.position = 'static';
                footer.classList.remove('active');
                content.style.paddingBottom = '0px';
            }
        };
        adjustFooter();
        window.addEventListener('load', adjustFooter);
        window.addEventListener('resize', adjustFooter);
    };
});