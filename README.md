"Should I be worried?" is a little quarantine hobby project that I started
because, on the one hand, I wasn't too happy with how existing dashboards are
presenting Covid-19 case data, and, on the other hand, like many others, I wanted
to use the lockdown to learn a new skill, in this case React and modern
Javascript.

Click [here](https://shouldibeworried.github.io/covid19/) to see the website
live. 

## Table of Contents

- [Data sources](#data-sources)
- [What the numbers mean, and how they're calculated](#what-the-numbers-mean-and-how-theyre-calculated)
- [Frequently asked questions](#frequently-asked-questions)


## Data source

Currently, all data is sourced from
[Johns Hopkins time series data](https://github.com/CSSEGISandData/COVID-19).
In the future, I might include other data sources, especially for places such
as France where Johns Hopkins data differs a lot from official data.

For now, only US states and Canadian provinces as well as European countries
(current and former EU member + Schengen states) are available. I might add
other regions in the future.

Population data is from Wikipedia.


## What the numbers mean, and how they're calculated

### Confirmed recent infections

With Covid-19, people are most infectious when they have recently been infected
themselves. The number of recent infections per capita, epidemiologists call
this the incidence of the disease, therefore gives you an idea how risky it is
to interact with others. If you were to share an Uber Pool with a random
stranger, this number can tell you the odds that this person can give you
Covid-19.

It's easy to calculate as well - simply add up the reported new cases over the
last seven days, then divide by the state's, province's, or country's
population and multiply by 100,000.


### Basic reproduction number

The basic reproduction number, also called the R0, indicates a trend: have
things been getting better or worse over the past week? If it's below 1, things
are getting better, if it's above 1, things are getting worse.

It is defined as the average number of people that one sick person infects.
[In this video](https://www.youtube.com/watch?v=22SQVZ4CeXA), Germany's
chancellor Angela Merkel explains it much better than I ever could.

It is also the number that you want to look at if you want to understand if
public health measures are effective. For example, if your state has recently
ordered people to wear masks you should expect the R0 to go down about 1-2
weeks after the measure has been introduced.

To calculate it, we also need to know to know how long it takes, on average,
from when someone gets infected and when they pass it on. Epidemiologists call
this the serial interval. For Covid-19, this is estimated to be around 5-6 days
(the website uses 5 days). As an estimate for R0, we can simply take the new
cases of the last 5 days, and divide by the cases of the previous 5 day
interval, that is from 10 to 5 days ago. On this website, I'm then taking the
average of this number over a 7 day period. 


### Estimated infections

When
[randomized antibody testing was conducted in Sweden](https://www.folkhalsomyndigheten.se/contentas-sets/6561cbb8fcb8435788fb69f5fd1b4356/seroepi-demiologiska-studier-genomgangen-covid-1-delrap-port-1.pdf)
researchers found that between 4-6% of Swedes had antibodies for Covid-19. With
a population of about 10 million this works out to 400,000-600,000 people. The
study ended on May 17, 2020, and yet on that day Sweden had only about 30,000
recorded cases. In other words, there must have been between 12 and 19 unknown
infections for every know case!

This website attempts to quantify how much larger the true number of infections
is, compared to the recorded cases. It does this, by comparing the case
fatality ratio to the infection fatality ratio. _Case fatality rate_ is the
ratio of people with a _known_ Covid infection who die from the disease, while
the _infection fatality rate_ is the ratio of _all_ infected people, known or
unknown, who die from the disease. The difference between the two, tells us how
many unknown infections there are.

The case fatality rate is something we can estimate from the data. To do this,
I'm simply dividing a month's worth of recorded deaths by a month's worth of
new cases. Since deaths lag typically lag a bit behind cases, I'm assuming an
offset of 16 days between deaths and cases.

I will say, that this is not perfect. There is some evidence that in many
places, deaths are underreported, but not nearly as much as cases.

The infection fatality rate is the big unknown here. Scientists don't know the
precise value of it, yet, but they
[have settled on a range between 0.5% and 1.0%](https://www.medrxiv.org/content/10.1101/2020.05.03.20089854v3).
It will likely also change a bit depending on a country's age distribution,
preexisting conditions, health care system etc. Just to be safe, I'm assuming
an even wider range between 0.3% and 1.2%. This is why you see such a wide
range on the website. For example, for Sweden it currently says that the
total number of infections is between 5 and 20 times the number of known cases.


### Projected deaths

This is a very course estimate of deaths, under some simplifications.
I'm assuming that the R0 stays the same over the course of the next weeks.

I'm starting by calculating the number of cases that will contribute to the
next 30 day's deaths. Because I'm assuming a 16 day offset between testing
positive and death, I get the first 16 days worth of cases directly from the
data. For the remaining 14 days, I'm simply projecting cases one serial
interval at a time, under the assumption of a constant R0. This gives me a
projection of cases that will contribute to next month's deaths. Multiplying
that with the case fatality rate is an easy first guess at the number of deaths
in the following month.


## Frequently asked questions

### Why does it say that the R0 won't be reflected in the number of deaths?

This probably means that your state, province, or country's R0 has recently
tipped from above 1 to below or vice versa.

For example, a state might be coming out of a lockdown, which means that case
numbers are currently exceptionally low, but R0 might already have picked up.
Since deaths are always a bit delayed with respect to cases, there will be some
time where you're still benefitting from the presently low numbers of cases.


### Why take the 7 day average over the R0, and not just show the current value?

In particular in places with little disease activity, the R0 can fluctuate a
lot. Other places have a property that they report more cases on weekdays, when
testing labs are fully staffed and fewer on the weekends. I believe that by
taking the average over a 7 day period, we can get a more meaningful number.
This comes, of course at the expense of having a delay before you can see the
full effect of a new policy. 


### Why does it not show the R0, projected deaths, or estimated infection for some places?

Once the number of cases becomes too small, the calculations become susceptible
to noise. That's why I'm not calculating these numbers unless there is a
minimum number of cases and deaths.

For the [estimated cases](#estimated-infections) I have added an additional
criterion that the case fatality must be greater than 0.5%, that is the lower
bound of the presumed infection fatality interval. A case fatality below that
almost certainly means that a country is underreporting deaths. Yes, I'm
looking at you, Spain.
