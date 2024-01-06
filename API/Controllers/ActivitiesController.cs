using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController: BaseApiController{

   
    [HttpGet] //api/activities
    public async Task<ActionResult<List<Domain.Activity>>> GetActivities(){
        return await Mediator.Send(new List.Query());
    }
    [HttpGet("{id}")]
    
    public async Task<ActionResult<Domain.Activity>> GetActivity(Guid id){
        return await Mediator.Send(new Details.Query{Id=id});
    }

    [HttpPost]
    public async Task<ActionResult> CreateActivity(Domain.Activity activity){
        await Mediator.Send(new Create.Command{Activity = activity});
        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> EditActivity(Guid id,Domain.Activity activity){
        activity.ID = id;
        await Mediator.Send(new Edit.Command{Activity = activity});
        return Ok();
    }
    [HttpDelete("{id}")]

    public async Task<IActionResult> DeleteActivity(Guid id){
         await Mediator.Send(new Delete.Command{Id = id});
         return Ok();
    }
    
}
}