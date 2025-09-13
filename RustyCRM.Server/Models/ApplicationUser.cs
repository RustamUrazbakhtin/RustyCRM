using Microsoft.AspNetCore.Identity;

namespace RustyCRM.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Basic profile
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        // Дополнительные контакты
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public DateTime? DateOfBirth { get; set; }

        // Организация / CRM context
        public string? CompanyName { get; set; }
        public string? JobTitle { get; set; }

        // Системные поля
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }

        // Флаги
        public bool IsActive { get; set; } = true;
    }
}
