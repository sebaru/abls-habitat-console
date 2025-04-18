<div class="container">

 <div class="row m-2">
   <h3><i class="fas fa-eye text-primary"></i> Etat du module '<strong id="idTitle"></strong>'</h3>

   <div class ="col-auto ms-auto btn-group align-items-center">
        <button type="button" onclick="Go_to_mnemos()" class="btn btn-primary"><i class="fas fa-book"></i> Mnemos</button>
        <button type="button" onclick="Go_to_dls_source()" class="btn btn-primary"><i class="fas fa-code"></i> Source</button>
        <button type="button" onclick="Redirect('/dls')" class="btn btn-secondary"><i class="fas fa-list"></i> Liste DLS</button>
         <!-- <button type="button" class="btn btn-sm btn-primary rounded-circle"><i class="fas fa-plus"></i></button>-->
   </div>
</div>
<hr>

<!----------------------------------------------------------------------------------------------------------------------------->
 <div class="row m-2">
      <h4><img style="width: 30px" data-bs-toggle="tooltip" title="Entrées TOR"
                       src="https://static.abls-habitat.fr/img/entree.png" /> Entrées TOR</h4>
     <div class="ms-auto">
        <button type="button" onclick="Dls_run_refresh('idTableEntreeTOR')" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
     </div>
</div>

     <div class="table-responsive">
      <table id="idTableEntreeTOR" class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
        </thead>
        <tbody>
        </tbody>
      </table>
     </div>

   <hr>
<!----------------------------------------------------------------------------------------------------------------------------->
 <div class="row m-2">
      <h4><img style="width: 30px" data-bs-toggle="tooltip" title="Entrées ANA"
                       src="https://static.abls-habitat.fr/img/entree_analogique.png" /> Entrées ANA</h4>
     <div class="ms-auto">
        <button type="button" onclick="Dls_run_refresh('idTableEntreeANA')" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
     </div>
</div>

   <div class="table-responsive">
      <table id="idTableEntreeANA" class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
        </thead>
        <tbody>
        </tbody>
      </table>
   </div>

      <hr>
<!----------------------------------------------------------------------------------------------------------------------------->
 <div class="row m-2">
      <h4><img style="width: 30px" data-bs-toggle="tooltip" title="Sorties TOR"
                       src="https://static.abls-habitat.fr/img/sortie.png" /> Sorties TOR</h4>
     <div class="ms-auto">
        <button type="button" onclick="Dls_run_refresh('idTableSortieTOR')" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
     </div>
</div>

   <div class="table-responsive">
      <table id="idTableSortieTOR" class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
        </thead>
        <tbody>
        </tbody>
      </table>
   </div>

      <hr>
<!----------------------------------------------------------------------------------------------------------------------------->
 <div class="row m-2">
      <h4><img style="width: 30px" data-bs-toggle="tooltip" title="Sorties ANA"
                       src="https://static.abls-habitat.fr/img/sortie_analogique.png" /> Sorties ANA</h4>
     <div class="ms-auto">
        <button type="button" onclick="Dls_run_refresh('idTableSortieANA')" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
     </div>
</div>

   <div class="table-responsive">
      <table id="idTableSortieANA" class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
        </thead>
        <tbody>
        </tbody>
      </table>
   </div>
      <hr>

<!----------------------------------------------------------------------------------------------------------------------------->
 <div class="row m-2">
      <h4><img style="width: 30px" data-bs-toggle="tooltip" title="Registres"
                       src="https://static.abls-habitat.fr/img/calculatrice.png" /> Registres</h4>
     <div class="ms-auto">
        <button type="button" onclick="Dls_run_refresh('idTableRegistre')" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
     </div>
</div>

   <div class="table-responsive">
      <table id="idTableRegistre" class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
        </thead>
        <tbody>
        </tbody>
      </table>
   </div>
      <hr>

<!----------------------------------------------------------------------------------------------------------------------------->
 <div class="row m-2">
      <h4><img style="width: 30px" data-bs-toggle="tooltip" title="Compteurs d'impulsions"
                       src="https://static.abls-habitat.fr/img/front_montant.png" /> Compteurs d'impulsions</h4>
     <div class="ms-auto">
        <button type="button" onclick="Dls_run_refresh('idTableCI')" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
     </div>
</div>

   <div class="table-responsive">
      <table id="idTableCI" class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
        </thead>
        <tbody>
        </tbody>
      </table>
   </div>
      <hr>

<!----------------------------------------------------------------------------------------------------------------------------->
 <div class="row m-2">
      <h4><img style="width: 30px" data-bs-toggle="tooltip" title="Compteurs horaires"
                       src="https://static.abls-habitat.fr/img/compteur_horaire.png" /> Compteurs horaires</h4>
     <div class="ms-auto">
        <button type="button" onclick="Dls_run_refresh('idTableCH')" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
     </div>
</div>

   <div class="table-responsive">
      <table id="idTableCH" class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
        </thead>
        <tbody>
        </tbody>
      </table>
   </div>
<hr>

<!----------------------------------------------------------------------------------------------------------------------------->
 <div class="row m-2">
      <h4><img style="width: 30px" data-bs-toggle="tooltip" title="Messages"
                       src="https://static.abls-habitat.fr/img/message.png" /> Messages</h4>
     <div class="ms-auto">
        <button type="button" onclick="Dls_run_refresh('idTableMessages')" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
     </div>
</div>

   <div class="table-responsive">
      <table id="idTableMessages" class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
        </thead>
        <tbody>
        </tbody>
      </table>
   </div>
      <hr>

<!----------------------------------------------------------------------------------------------------------------------------->
<div class="row m-2">
      <h4><img style="width: 30px" data-bs-toggle="tooltip" title="Monostables"
                       src="https://static.abls-habitat.fr/img/message.png" /> Monostables</h4>
     <div class="ms-auto">
        <button type="button" onclick="Dls_run_refresh('idTableMONO')" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
     </div>
</div>

   <div class="table-responsive">
      <table id="idTableMONO" class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
        </thead>
        <tbody>
        </tbody>
      </table>
   </div>
      <hr>

<!----------------------------------------------------------------------------------------------------------------------------->
<div class="row m-2">
      <h4><img style="width: 30px" data-bs-toggle="tooltip" title="Bistables"
                       src="https://static.abls-habitat.fr/img/message.png" /> Bistables</h4>
     <div class="ms-auto">
        <button type="button" onclick="Dls_run_refresh('idTableBI')" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
     </div>
</div>

   <div class="table-responsive">
      <table id="idTableBI" class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
        </thead>
        <tbody>
        </tbody>
      </table>
   </div>
      <hr>

<!----------------------------------------------------------------------------------------------------------------------------->
<div class="row m-2">
      <h4><span><i class="fas fa-eye text-primary"></i></span> Visuels</h4>
     <div class="ms-auto">
        <button type="button" onclick="Dls_run_refresh('idTableVisuel')" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
     </div>
</div>

   <div class="table-responsive">
      <table id="idTableVisuel" class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
        </thead>
        <tbody>
        </tbody>
      </table>
   </div>
      <hr>
<!-- Container -->
</div>

<script src="/js/dls_run.js" type="text/javascript"></script>
