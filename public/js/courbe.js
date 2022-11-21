/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    Charger_une_courbe ( "idChartCourbe", vars[2], vars[3], vars[4] )
	 }
