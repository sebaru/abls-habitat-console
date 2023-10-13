<div class="container">

 <div class="row m-2">
   <div class="col-auto"><h3><i class="fas fa-chart-line text-primary"></i> Voir la courbe</h3></div>

   <div class ="col-auto ms-auto btn-group align-items-center">
     <i class='fas fa-clock text-primary mr-2'></i>
     <select id='idCourbePeriod' class='custom-select' onchange='Courbe_Set_Period()'>
      <option value='HOUR'>Heure</option>
      <option value='DAY'>Jour</option>
      <option value='WEEK'>Semaine</option>
      <option value='MONTH'>Mois</option>
      <option value='YEAR'>Année</option>
      <option value='ALL'>Tout</option>
     </select>
   </div>

   <!--<div class ="ms-auto btn-group align-items-center">
        <button type="button" onclick="AUDIO_Add()" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter une connexion</button>
        <button type="button" onclick="AUDIO_Refresh()" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
   </div>-->
 </div>

<hr>

  <div class="row m-1 border border-info">
     <canvas id="idChartCourbe" class="col"></canvas>
  </div>

<script src="/js/courbe.js" type="text/javascript"></script>
<!-- Container -->
</div>
