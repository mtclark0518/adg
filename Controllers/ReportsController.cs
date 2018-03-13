using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using adg.Models;
using adg.Data;


namespace adg.Controllers
{
    [Route("api/[controller]")]
    public class ReportsController : Controller
    {
        private readonly DatabaseContext _dbcontext;

        public ReportsController(DatabaseContext dbcontext)
        {
            _dbcontext = dbcontext;
        }


        // Loads the user profile after successful login/register
        [HttpGet("{tag}")]
        public async Task<IActionResult> GetUserProfile(string tag)
        {
            var userProfile = await _dbcontext.UserProfiles
                                              .SingleAsync(r => r.IdentityId == tag);

            return new OkObjectResult(userProfile);
        }


        // User is prompted to update profile details upon registration
        [HttpPut("update/{tag}")]
        public async Task<IActionResult> SetUserProfile([FromBody]UserProfile model)
        {
            var update = await _dbcontext.UserProfiles.SingleAsync(r => r.IdentityId == model.IdentityId);
            _dbcontext.UserProfiles.Update(update);
            update.FirstName = model.FirstName;
            update.LastName = model.LastName;
            update.Handle = model.Handle;
            await _dbcontext.SaveChangesAsync();
            return new OkObjectResult(update);
        }


        // Receives a new 'report'. 
        //Creates 'report' and 
        // Returns user profile including their reports 
        [HttpPost("{tag}")]
        public async Task<IActionResult> CreateCrapReport([FromBody]Report model, string tag)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userProfile = await _dbcontext.UserProfiles
                                            .Include(u => u.Reports)
                                            .SingleOrDefaultAsync(u => u.IdentityId == tag);


            userProfile.Reports.Add(new Report
            {
                Latitude = model.Latitude,
                Longitude = model.Longitude,
                Texture = model.Texture,
                Smell = model.Smell,
                Color = model.Color,
            });
            await _dbcontext.SaveChangesAsync();
            return new OkObjectResult(userProfile);
        }




        // * TODO This needs revision. It works but woudn't scale very well if additional filter parameters are added
        // * TODO replace strings with enums

        // Request object contains 4 booleans and three arrays of type string
        // 1 boolean checks if user wants only their own data
        // next 3 correspond to 3 filter parameters 'color, smell, texture'
        // Returns a list of 'reports' based on selected  choices
        [HttpPost("filter")]
        public async Task<IActionResult> Filter([FromBody]ReportQuery rq)
        {
            // checks that request body is straight
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // user is requesting reports from all other users
            if (!rq.filtered)
            {
                var unfiltered = await _dbcontext.Reports.ToListAsync();

                // user has included smell filters
                if (rq.bySmell)
                {
                    var smellFilter = SmellFilter(unfiltered, rq);

                    // user has smell and color filters
                    if (rq.byColor)
                    {
                        var colorfilter = ColorFilter(smellFilter, rq);

                        // user has smell, color and texture filters
                        if (rq.byTexture)
                        {
                            var texturefilter = TextureFilter(colorfilter, rq);

                            // return all reports filtered by smell, color, texture
                            return new OkObjectResult(texturefilter);
                        }

                        // return all reports filtered by smell & color only
                        return new OkObjectResult(colorfilter);
                    }

                    // user has smell and texture filters
                    if (rq.byTexture)
                    {
                        var texturefilter = TextureFilter(smellFilter, rq);

                        // return all reports filtered by smell & texture only
                        return new OkObjectResult(texturefilter);
                    }

                    // returns all reports filtered by smell only
                    return new OkObjectResult(smellFilter);
                }

                // user has included color filters
                if (rq.byColor)
                {
                    var colorfilter = ColorFilter(unfiltered, rq);

                    // user has inlcuded texture filters
                    if (rq.byTexture)
                    {
                        var texturefilter = TextureFilter(colorfilter, rq);

                        // returns all reports filtered by color & texture only
                        return new OkObjectResult(texturefilter);
                    }

                    // returns all reports filtered by color only
                    return new OkObjectResult(colorfilter);
                }

                // user has selected texture filters
                if (rq.byTexture)
                {
                    var texturefilter = TextureFilter(unfiltered, rq);

                    // returns all reports filtered by texture only
                    return new OkObjectResult(texturefilter);
                }
                else
                {
                    // returns all reports without app
                    return new OkObjectResult(unfiltered);
                }
            }

            //
            // TODO This is redundant code regarding the filtering but returns only the users own reports
            // 

            var filtered = await _dbcontext.Reports.Where(d => d.UserProfileId == rq.requester).ToListAsync();

            if (rq.bySmell)
            {
                var smellFilter = SmellFilter(filtered, rq);
                if (rq.byColor)
                {
                    var colorfilter = ColorFilter(smellFilter, rq);
                    if (rq.byTexture)
                    {
                        var texturefilter = TextureFilter(colorfilter, rq);
                        return new OkObjectResult(texturefilter);
                    }
                    return new OkObjectResult(colorfilter);
                }
                if (rq.byTexture)
                {
                    var texturefilter = TextureFilter(smellFilter, rq);
                    return new OkObjectResult(texturefilter);
                }
                return new OkObjectResult(smellFilter);
            }
            if (rq.byColor)
            {
                var colorfilter = ColorFilter(filtered, rq);
                if (rq.byTexture)
                {
                    var texturefilter = TextureFilter(colorfilter, rq);
                    return new OkObjectResult(texturefilter);
                }

                return new OkObjectResult(colorfilter);
            }
            if (rq.byTexture)
            {
                var texturefilter = TextureFilter(filtered, rq);
                return new OkObjectResult(texturefilter);
            }
            else
            {
                return new OkObjectResult(filtered);
            }
        }





        // TODO The following 3 methods could be condensed into a single method

        // receives a list of reports and the filter parameters
        // returns only the reports that contain specified query params
        private List<Report> ColorFilter(List<Report> reports, ReportQuery rq)
        {
            List<Report> MyColors = new List<Report>();
            foreach (string prop in rq.ColorFilter)
            {
                foreach (Report report in reports)
                {
                    if (prop == report.Color)
                    {
                        MyColors.Add(report);
                    }
                }
            }
            return MyColors.ToList();
        }

        // receives a list of reports and the filter parameters
        // returns only the reports that contain specified query params
        private List<Report> SmellFilter(List<Report> reports, ReportQuery rq)
        {
            List<Report> MySmells = new List<Report>();
            foreach (string prop in rq.SmellFilter)
            {
                foreach (Report report in reports)
                {
                    if (prop == report.Smell)
                    {
                        MySmells.Add(report);
                    }
                }
            }
            return MySmells.ToList();
        }

        // receives a list of reports and the filter parameters
        // returns only the reports that contain specified query params
        private List<Report> TextureFilter(List<Report> reports, ReportQuery rq)
        {
            List<Report> MyTextures = new List<Report>();
            foreach (string prop in rq.TextureFilter)
            {
                foreach (Report report in reports)
                {
                    if (prop == report.Texture)
                    {
                        MyTextures.Add(report);
                    }
                }
            }
            return MyTextures.ToList();
        }
    }
}

