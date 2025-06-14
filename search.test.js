/**
 * @jest-environment jsdom
 */


//Mock fetch for the search function
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ items: [{ formattedUrl: "url", htmlTitle: "title", htmlSnippet: "snippet" }] }),
    })
);

// Mock Blob and URL.createObjectURL for the test environment
global.Blob = function (content, options) {
    this.content = content;
    this.options = options;
};
global.URL = {
    createObjectURL: jest.fn(() => 'blob:mockurl')
};

//Mock the index.html structure
document.body.innerHTML = `
  <a id="downloadBtn"></a>
  <input id="searchInput" />
  <div class="search-result"></div>
`;

const { setUpDownloadElement, search, loadSearchResults} = require('./search.js');

describe('search', () => {
  it('should fetch and return data', async () => {
    const data = await search('test');
    expect(data.items).toBeDefined();
    expect(fetch).toHaveBeenCalled();
  });
});

describe('setUpDownloadElement', () => {
  it('should set href and download attributes when data is present', () => {
        const mockElement = {
            removeAttribute: jest.fn(),
            classList: { add: jest.fn(), remove: jest.fn() }
        };
        const data = [{ foo: 'bar' }];
        setUpDownloadElement(data, 'test.json', mockElement);
        expect(mockElement.href).toBe('blob:mockurl');
        expect(mockElement.download).toBe('test.json');
    });

    it('should disable the element when data is empty', () => {
        const mockElement = {
            removeAttribute: jest.fn(),
            classList: { add: jest.fn(), remove: jest.fn() }
        };
        setUpDownloadElement([], 'test.json', mockElement);
        expect(mockElement.removeAttribute).toHaveBeenCalledWith('href');
        expect(mockElement.removeAttribute).toHaveBeenCalledWith('download');
        expect(mockElement.classList.add).toHaveBeenCalledWith('disabled');
    });
});

describe('loadSearchResults', () => {
  it('should render results', () => {
    const element = { innerHTML: '', appendChild: jest.fn() };
    const results = [{ formattedUrl: 'url', htmlTitle: 'title', htmlSnippet: 'snippet' }];
    loadSearchResults(results, element);
    expect(element.appendChild).toHaveBeenCalled();
  });

  it('should show "No results found."', () => {
    const element = { innerHTML: '', textContent: '' };
    loadSearchResults([], element);
    expect(element.textContent).toBe('No results found.');
  });
});