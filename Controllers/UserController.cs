using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using adg.Models;
using adg.Data;


namespace adg.Controllers
{

    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly IOptions<IdentityOptions> _identityOptions;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly DatabaseContext _dbContext;

        public UserController(
            IOptions<IdentityOptions> identityOptions,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            DatabaseContext dbContext,
            ILogger<UserController> logger,
            IConfiguration configuration
            )
        {
            _identityOptions = identityOptions;
            _signInManager = signInManager;
            _userManager = userManager;
            _logger = logger;
            _configuration = configuration;
            _dbContext = dbContext;
        }


        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<object> Login([FromBody]NewUser user)
        {
            _logger.LogInformation(user.UserName);
            if (ModelState.IsValid)
            {
                _logger.LogInformation("model state is valid");

                var findUser = await _userManager.FindByNameAsync(user.UserName);
                if (findUser == null)
                {
                    return BadRequest(new
                    {
                        error = "invalid_user",
                        error_description = "No user by that name."
                    });
                }

                var loginResult = await _signInManager.PasswordSignInAsync(user.UserName, user.Password, false, false);
                if (loginResult.Succeeded)
                {
                    _logger.LogInformation("login successful");

                    var appUser = _userManager.Users.SingleOrDefault(r => r.UserName == user.UserName);
                    var userProfile = _dbContext.UserProfiles.SingleOrDefault(r => r.IdentityId == appUser.Id);
                    return await GenerateJwtToken(userProfile.Handle, appUser);
                }
                return BadRequest(new
                {
                    error = "invalid_password",
                    error_description = "incorrect password"
                });
            }
            return BadRequest(new
            {
                error = "model_state_invalid",
                error_description = "invalid modelState"
            });
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<object> Register([FromBody] NewUser newUser)
        {
            var makeuser = new ApplicationUser
            {
                UserName = newUser.UserName,
                Email = newUser.UserName
            };
            var result = await _userManager.CreateAsync(makeuser, newUser.Password);

            if (result.Succeeded)
            {
                await _dbContext.UserProfiles.AddAsync(new UserProfile
                {
                    IdentityId = makeuser.Id,
                    Handle = makeuser.UserName,
                });

                await _dbContext.SaveChangesAsync();
                await _signInManager.SignInAsync(makeuser, false);
                var userProfile = _dbContext.UserProfiles.SingleOrDefault(r => r.Identity == makeuser);
                return await GenerateJwtToken(userProfile.Handle, makeuser);
            }

            throw new ApplicationException("UNKNOWN_ERROR");
        }

        [HttpPost("signout")]
        //[ValidateAntiForgeryToken]
        public async Task<object> Logout()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation("User logged out.");
            return Redirect("/");
        }
        private async Task<string> GenerateJwtToken(string username, IdentityUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.UserName),
                new Claim(JwtRegisteredClaimNames.NameId, user.Id),
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("thisisaSecretKeySHHHHHdonttell"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: "im_valid",
                audience: "im_valid",
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}