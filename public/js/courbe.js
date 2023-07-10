/********************************************* Changement de période **********************************************************/
 function Courbe_Set_Period ()
  { vars = window.location.pathname.split('/');
    Redirect ( "/courbe/"+vars[2]+"/"+vars[3]+"/"+$("#idCourbePeriod").val() );
  }
/********************************************* Chargement d(une courbe ********************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    Charger_une_courbe ( "idChartCourbe", vars[2], vars[3], vars[4] )
  }
