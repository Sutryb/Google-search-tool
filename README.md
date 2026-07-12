# Google Search Tool

Jednoduchá a rychlá webová aplikace pro získávání a export organických výsledků vyhledávání z Googlu. Projekt byl vytvořen jako technické zadání pro společnost INIZIO Internet Media s.r.o.

## Klíčové vlastnosti

* **Vyhledávání v reálném čase** – Získání TOP 10 organických výsledků z první stránky Googlu pro český region a v češtině.
* **Export dat** – Možnost okamžitého stažení výsledků jedním kliknutím do formátů JSON a CSV.
* **Moderní a responzivní design** – Čisté uživatelské rozhraní optimalizované pro desktop i mobilní zařízení.
* **Automatizované testy** – Pokrytí backendové logiky a API endpointů pomocí unit testů, kde všech 7 testů úspěšně prochází.
* **Připraveno pro Docker** – Snadné a rychlé lokální spuštění celé aplikace v izolovaném kontejneru.

## Použité technologie

* **Backend:** Node.js, Express, Axios
* **Frontend:** Čisté HTML5, CSS3, JavaScript (Fetch API)
* **Testování:** Jest, Supertest
* **Kontejnerizace:** Docker, Docker Compose

## Rychlé spuštění lokálně

Pro spuštění aplikace na lokálním počítači postupujte podle následujících kroků:

1. Nainstalujte potřebné závislosti:
```bash
npm install
