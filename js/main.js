(function(){
  // Ссылки на Telegram (замените на нужный ник, если изменится)
  var TG = "https://t.me/IvuegenI";
  document.querySelectorAll("[data-tg]").forEach(function(a){ a.href = TG; a.target = "_blank"; a.rel = "noopener"; });

  var SCRIPTS = {
    studio: {
      name: "Студия «Лотос»", ava: "Л",
      lines: [
        ["me", "Здравствуйте! Есть ли у вас занятия для начинающих?"],
        ["bot", "Здравствуйте! Да, есть. Хатха-йога для начинающих проходит в понедельник и среду в 19:00 и в субботу в 11:00. Хотите записаться на пробное занятие?"],
        ["me", "Да, на субботу. Сколько стоит?"],
        ["bot", "Пробное занятие 500 ₽. В субботу в 11:00 осталось 3 места. Как вас зовут?"],
        ["me", "Анна"],
        ["bot", "Анна, готово! Записала вас на субботу, 11:00. Адрес: ул. Ленина, 50а. Накануне напомню о занятии."],
        ["bot", "Совет: возьмите удобную одежду и воду. Коврики есть у нас."]
      ]
    },
    clinic: {
      name: "Стоматология «Дента»", ava: "Д",
      lines: [
        ["me", "Добрый вечер, у меня болит зуб, можно записаться на завтра?"],
        ["bot", "Добрый вечер! Сочувствую, постараемся помочь. На завтра есть окна в 10:30, 14:00 и 17:30. Какое время удобно?"],
        ["me", "14:00"],
        ["bot", "Записала вас на завтра в 14:00 на приём к врачу-стоматологу. Как вас зовут и какой телефон оставить для связи?"],
        ["me", "Игорь, +7 900 123-45-67"],
        ["bot", "Игорь, всё записано. Утром напомню о визите. Если боль усилится до приёма, позвоните по номеру клиники, мы примем раньше."]
      ]
    },
    back: {
      name: "Студия «Лотос»", ava: "Л",
      lines: [
        ["bot", "Анна, давно вас не видели в «Лотосе». Скучаем! В эту субботу в 11:00 есть свободные места на мягкую практику. Записать вас?"],
        ["me", "Ой, да, закрутилась. Давайте"],
        ["bot", "Записала вас на субботу, 11:00. Накануне пришлю напоминание. Ждём!"],
        ["bot", "Для владельца: сегодня этим сообщением возвращено 4 клиента, записей на неделю +4."]
      ]
    }
  };

  function play(chatEl, lines, loop){
    var timers = [], i = 0;
    function clear(){ timers.forEach(clearTimeout); timers = []; }
    function reset(){ chatEl.innerHTML = ""; i = 0; }
    function add(kind, text){
      var d = document.createElement("div");
      d.className = "msg " + kind; d.textContent = text; chatEl.appendChild(d);
      chatEl.scrollTop = chatEl.scrollHeight;
    }
    function step(){
      if(i >= lines.length){ if(loop){ timers.push(setTimeout(function(){ reset(); step(); }, 3200)); } return; }
      var l = lines[i++];
      if(l[0] === "bot"){
        var t = document.createElement("div"); t.className = "msg bot typing"; t.innerHTML = "<i></i><i></i><i></i>"; chatEl.appendChild(t);
        chatEl.scrollTop = chatEl.scrollHeight;
        timers.push(setTimeout(function(){ chatEl.removeChild(t); add("bot", l[1]); timers.push(setTimeout(step, 700)); }, 900));
      } else {
        timers.push(setTimeout(function(){ add("me", l[1]); timers.push(setTimeout(step, 600)); }, 700));
      }
    }
    reset(); step();
    return clear;
  }

  var hero = document.getElementById("hero-chat");
  if(hero) play(hero, SCRIPTS.studio.lines, true);

  var tabChat = document.getElementById("tab-chat"), stop = null;
  function openTab(k){
    var s = SCRIPTS[k];
    document.getElementById("tab-name").textContent = s.name;
    document.getElementById("tab-ava").textContent = s.ava;
    if(stop) stop();
    stop = play(tabChat, s.lines, true);
    document.querySelectorAll(".tab").forEach(function(b){ b.classList.toggle("on", b.dataset.tab === k); });
  }
  document.querySelectorAll(".tab").forEach(function(b){ b.addEventListener("click", function(){ openTab(b.dataset.tab); }); });
  if(tabChat){
    if("IntersectionObserver" in window){
      var started = false, io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting && !started){ started = true; openTab("studio"); io.disconnect(); } }); }, {threshold:.25});
      io.observe(document.getElementById("dialogs"));
    } else openTab("studio");
  }
})();
