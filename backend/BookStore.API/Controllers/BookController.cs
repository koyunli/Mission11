using BookStore.API.Data;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BookController : Controller
{
    private BookDbContext _bookContext;

    public BookController(BookDbContext temp)
    {
        _bookContext = temp;
    }

    [HttpGet("AllBooks")]
    public IActionResult GetBooks(int pageSize = 5, int pageNum = 1)
    {
        var booksPage = _bookContext.Books
            .OrderBy(b => b.Title)
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var totalNumBooks = _bookContext.Books.Count();

        var response = new
        {
            Books = booksPage,
            TotalNumBooks = totalNumBooks
        };

        return Ok(response);
    }
}