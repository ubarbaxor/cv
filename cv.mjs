import { h2, h3 } from './src/helpers.mjs'
import renderPicture from './src/picture.mjs'

import data from './resume.json' assert { type: 'json' }

const renderCv = data => {
    const sections = Object.keys(data)
    const renderer = document.getElementById('main')

    sections.forEach(s => {
        renderer.appendChild(renderSection(data[s], s))
    })
}

const renderSection = (data, name) => {
    if (renderers[name])
        return renderers[name](data)

    const section = document.createElement('section')
    section.appendChild(h2(name))

    const content = document.createElement('div')
    content.classList.add('section-content')

    if (renderers[name]) {
        const subsections = renderers[name](data)
        subsections.forEach(sub => content.appendChild(sub))
    } else {
        const pre = document.createElement('pre')
        pre.innerText = JSON.stringify(data, null, 2)
        content.appendChild(pre)
    }
    section.appendChild(content)

    return section
}

const renderInfo = data => {
    const section = document.createElement('section')

    section.appendChild(h2(data.name))

    if (data.picture)
        section.appendChild(renderPicture(data.picture))

    const title = document.createElement('h3')
    title.innerText = data.label
    section.appendChild(title)

    const contacts = document.createElement('table')
    contacts.id = 'contact'
    const addContact = (label, content) => {
        const row = document.createElement('tr')
        const l = document.createElement('td')
        l.innerText = label
        const c = document.createElement('td')
        c.innerHTML = content
        row.appendChild(l)
        row.appendChild(c)

        contacts.appendChild(row)
    }
    ['email', 'phone'].forEach(entry => addContact(entry, data[entry]))
    data.profiles.forEach(({ network, username, url }) => {
        const label = network
        const content = document.createElement('a')
        content.href = url
        content.innerText = username

        addContact(label, content.outerHTML)
    })

    section.appendChild(contacts)

    return section
}


const renderJob = experience => {
    const renderer = document.createElement('div')
    const jobHeader = document.createElement('div')
    renderer.appendChild(jobHeader)

    jobHeader.className = 'sub'
    jobHeader.appendChild(h3(experience.company))

    if (experience.position) {
        const position = document.createElement('b')
        position.innerText = experience.position
        jobHeader.appendChild(position)
    }

    const { date, startDate, endDate } = experience
    if (date || startDate) {
        const duration = document.createElement('div')
        duration.innerText = startDate
            ? `${startDate?.replaceAll('-', '.').concat(' - ') || ''}${endDate?.replaceAll('-', '.') || 'present'}`
            : date?.replaceAll('-', '.')
        jobHeader.appendChild(duration)
    }

    if (experience.website) {
        const reflink = document.createElement('div')
        reflink.className = 'employer-link'
        const icon = document.createElement('span')
        icon.className = 'icon'
        icon.innerText = '🔗'
        reflink.appendChild(icon)

        const anchor = document.createElement('a')
        if (experience.website.startsWith('https'))
            anchor.href = experience.website
        else anchor.classList.add('deadlink')
        anchor.innerText = experience.website
        reflink.appendChild(anchor)

        renderer.appendChild(reflink)
    }

    if (experience.summary) {
        const summary = document.createElement('p')
        summary.className = 'summary'
        summary.innerText = experience.summary
        renderer.appendChild(summary)
    }

    if (experience.highlights) {
        const highlights = document.createElement('div')
        experience.highlights.forEach(tag => {
            const label = document.createElement('span')
            label.innerText = tag
            label.className = 'tag'
            highlights.appendChild(label)
        })
        renderer.appendChild(highlights)
    }

    return renderer
}

const renderExperiences = (data, headingText = 'work') => {
    const section = document.createElement('section')
    const title = document.createElement('h2')
    title.innerText = headingText
    section.appendChild(title)

    const content = document.createElement('div')
    content.classList.add('section-content')

    data.forEach(experience => {
        const renderer = renderJob(experience)
        content.appendChild(renderer)
    })

    section.appendChild(content)

    return section
}

const renderVolunteering = data => {
    const toExperience = volunteeringExp => {
        const { organization, ...rest } = volunteeringExp
        return ({
            company: organization,
            ...rest,
        })
    }

    return renderExperiences(data.map(toExperience), 'volunteering')
}

const renderEducation = data => {
    const toExperience = education => {
        const { institution, area, studyType, courses, ...rest } = education
        return ({
            company: institution,
            position: area,
            summary: studyType,
            highlights: courses,
            ...rest,
        })
    }

    return renderExperiences(data.map(toExperience), 'education')
}

const renderAwards = data => {
    const toExperience = award => {
        const { title, awarder, ...rest } = award

        return ({
            company: awarder,
            position: title,
            ...rest
        })
    }

    return renderExperiences(data.map(toExperience), 'awards')
}

const renderPublications = data => {
    const toExperience = publication => {
        const { name, publisher, releaseDate, ...rest } = publication

        return ({
            company: name,
            position: publisher,
            date: releaseDate,
            ...rest,
        })
    }

    return renderExperiences(data.map(toExperience), 'publications')
}

const renderSkills = data => {
    const toExperience = skill => {
        const { name, level, keywords, ...rest } = skill

        return ({
            company: name,
            position: level,
            highlights: keywords,
            ...rest
        })
    }

    return renderExperiences(data.map(toExperience), 'skills')
}

const renderLanguages = data => {
    const toExperience = language => {
        const { name, level, ...rest } = language

        return ({
            company: name,
            position: level,
            ...rest
        })
    }

    return renderExperiences(data.map(toExperience), 'languages')
}

const renderInterests = data => {
    const toExperience = interest => {
        const { name, keywords, ...rest } = interest

        return ({
            company: name,
            highlights: keywords,
            ...rest
        })
    }

    return renderExperiences(data.map(toExperience), 'interests')
}

const renderers = {
    basics: renderInfo,
    work: renderExperiences,
    volunteer: renderVolunteering,
    education: renderEducation,
    awards: renderAwards,
    publications: renderPublications,
    skills: renderSkills,
    languages: renderLanguages,
    interests: renderInterests,
}

renderCv(data)