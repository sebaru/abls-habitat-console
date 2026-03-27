<div class="container">

 <div class="row m-2">
   <h3><i class="fas fa-database text-primary"></i> Paramétrage des Archives</h3>

 </div>

<hr>

       <div class="card m-1">
         <div class="card-header"> <label>Configuration</label> </div>
         <div class="card-body">

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Durée de retention chaude</label>
               <input id="idArchiveDBHotRetention" type="number" min="1" class="form-control" placeholder="Nombre de mois de retention">
               <span class="input-group-text">mois</span>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Nombre d'archives chaudes</label>
               <input id="idArchiveDBHotNumber" type="text" disabled class="form-control" placeholder="Nombre d'enregistrements">
               <span class="input-group-text">archives</span>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Taille des archives chaudes </label>
               <input id="idArchiveDBHotSize" type="text" disabled class="form-control" placeholder="Volume de stockage">
               <span class="input-group-text">MB</span>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Durée de retention froide</label>
               <input id="idArchiveDBColdRetention" type="number" min="1" class="form-control" placeholder="Nombre d'année de retention">
               <span class="input-group-text">années</span>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Nombre d'archives froide</label>
               <input id="idArchiveDBColdNumber" type="text" disabled class="form-control" placeholder="Nombre d'enregistrements">
               <span class="input-group-text">archives</span>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Taille des archives froides</label>
               <input id="idArchiveDBColdSize" type="text" disabled class="form-control" placeholder="Volume de stockage">
               <span class="input-group-text">MB</span>
             </div>
           </div>

         </div>

         <div class="card-footer d-flex">
              <button id="idDomainSaveButton" type="button" class="btn btn-success ms-auto" onclick="Archive_sauver_parametre()">
                <i class="fas fa-save"></i> Save
              </button>
         </div>


       </div>

<hr>

  <div class="row p-1 justify-content-center">
   <canvas id="idCourbeArchMaxFrag" class="courbe-dashboard border border-info"></canvas>
  </div>

  <div class="row p-1 justify-content-center">
   <canvas id="idCourbeArchNbHotArchives" class="courbe-dashboard border border-info"></canvas>
  </div>

  <div class="row p-1 justify-content-center">
   <canvas id="idCourbeArchNbColdArchives" class="courbe-dashboard border border-info"></canvas>
  </div>

<hr>

 <div class="row p-1">
   <div class="col-auto"> <h3><i class="fas fa-database text-primary"></i> Tables d'archivage chaudes</h3> </div>
   <div class ="col-auto ms-auto btn-group align-items-center">
      <button type="button" onclick="ARCHIVE_Hot_to_Cold()" class="btn btn-primary"><i class="fas fa-minus"></i> Hot to Cold</button>
   </div>
 </div>

    <table id="idTableArchiveHOT" class="table table-striped table-bordered table-hover w-100">
      <thead class="table-dark">
      </thead>
      <tbody>
      </tbody>
    </table>

<hr>

 <div class="row p-1">
   <div class="col-auto"> <h3><i class="fas fa-database text-primary"></i> Tables d'archivage froides</h3> </div>
   <div class ="col-auto ms-auto btn-group align-items-center">
      <button type="button" onclick="ARCHIVE_Delete_old_Cold()" class="btn btn-danger"><i class="fas fa-trash"></i> Delete Old</button>
   </div>
 </div>

    <table id="idTableArchiveCOLD" class="table table-striped table-bordered table-hover w-100">
      <thead class="table-dark">
      </thead>
      <tbody>
      </tbody>
    </table>

<!-- Container -->
</div>

<script src="/js/archive.js" type="text/javascript"></script>
