<?php
/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/
global $boolArray;
?>
<h2 class="StepTitle">Register</h2>
<div class="enrolment_steps">
<form>
  <div class="form-group">
    <label for="numOfStudents" class="mandatory">How many students will you be booking? </label>
    <select class="form-control" id="numOfStudents" required>
        <?php for($i=1;$i<=10;$i++){ ?>
            <option value="<?php echo $i; ?>"><?php echo $i; ?></option>
        <?php } ?>       
    </select>
  </div>
  <div class="form-group">
    <label for="includePayer" class="mandatory">Are you one of the students?</label>
    <select class="form-control" id="includePayer" required>
        <?php foreach($boolArray as $key=>$row){ ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>
        <?php } ?>       
    </select>
  </div>
  
</form>
</div>