/********************************************* Chargement d'une courbe ********************************************************/
 function Load_page ()
  { var vars = window.location.pathname.split('/');
    var tech_id = vars[2];
    var acronyme = vars[3];
    var period = vars[4];
    if (period == null || period === '') period = PeriodeTableau[0].valeur;

    var courbe_key = tech_id + ':' + acronyme;
    Set_page_context( courbe_key );

    $("#idCourbePeriod").replaceWith ( Select ( "idCourbePeriod", null, PeriodeTableau, period ) );
    $("#idCourbePeriod").off("change").on("change", function () { Redirect ( "/courbe/"+vars[2]+"/"+vars[3]+"/"+$("#idCourbePeriod").val() ); } );
    Charger_une_courbe ( "idChartCourbe", vars[2], vars[3], period, "AVG" )
  }
