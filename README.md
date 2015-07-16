# Real Purchasing Power Across US Metropolitan Areas, 2013

For the raw data used to make this visualization, [go here](https://github.com/TaxFoundation/data/tree/master/real-purchasing-power/current).

Using [Bureau of Economic Analysis data](http://www.bea.gov/newsreleases/regional/rpp/rpp_newsrelease.htm), these compiled data show real purchasing power at the metropolitan level. The BEA provides data on both the regional price parity (RPP) of [individual metropolitan areas](http://en.wikipedia.org/wiki/List_of_Metropolitan_Statistical_Areas), and the RPP averages of metropolitan and non-metropolitan counties in a state. We further break the data down and assign values at the county level depending on which metropolitan or non-metropolitan area a given county belongs to. Data for individual metropolitan areas are applied to all counties comprising that metro area, [as specified by the U.S. Census Bureau](https://www.census.gov/population/metro/files/lists/2009/List1.txt). All non-metropolitan counties in a state are assigned the state's non-metropolitan average. The BEA's RPP values are converted to dollar equivalents to express the real value of $100 in each measured location compared to the national average. The goal of combining these datasets is to show not just differences between metropolitan and non-metropolitan areas within states, but also between multiple metropolitan areas within a state.

This interactive visualization uses [D3.js](http://d3js.org/).

![The Real Value of $100 in Metropolitan Areas, 2013](http://taxfoundation.org/sites/taxfoundation.org/files/%24100%20Metro%20Map-03.png)

## Additional Resources

* [Tax Foundation: The Real Value of $100 in Metropolitan Areas 2013](http://interactive.taxfoundation.org/rpp2013/)
* [Bureau of Economic Analysis: Real Personal Income for States and Metropolitan Areas, 2013](http://www.bea.gov/newsreleases/regional/rpp/rpp_newsrelease.htm)
