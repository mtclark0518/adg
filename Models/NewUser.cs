using System;
using System.ComponentModel.DataAnnotations;
namespace adg.Models
{
    public class NewUser
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string UserName { get; set; }

        [Required]
        [MinLength(5)]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
