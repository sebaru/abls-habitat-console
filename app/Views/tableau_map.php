<div class="container">

 <div class="row m-2">
   <div class="col-auto"><h3><i class="fas fa-chart-line text-primary"></i> Courbes du Tableau <strong id="idTableauTitle"></strong></h3></div>

   <div class ="col-auto ms-auto btn-group align-items-center">
        <button type="button" onclick="Tableau_Map_Add()" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter</button>
        <button type="button" onclick="Redirect('/tableau')" class="btn btn-secondary"><i class="fas fa-list"></i> Liste</button>
   </div>
 </div>

<hr>

<div class="table-responsive">
  <table id="idTableTableauMap" class="table table-striped table-bordered table-hover">
    <thead class="table-dark">
    </thead>
    <tbody>
    </tbody>
  </table>
</div>


<!-- Container -->
</div>

<script src="/js/tableau_map.js" type="text/javascript"></script>
